import { createClient } from '@/utils/supabase/server'
import { openai } from '@ai-sdk/openai'
import { streamText, toUIMessageStream, createUIMessageStreamResponse, embed, generateText, convertToModelMessages } from 'ai'

const HOTWORDS = ['all', 'everything', 'entire', 'complete', 'whole', 'every', 'summarize', 'summary', 'overview', 'list', 'show me', 'what have i', 'what do i have', 'what topics', 'what subjects', 'across', 'throughout', 'broad']

function detectHotwords(question: string): boolean {
    return HOTWORDS.some(word => question.toLowerCase().includes(word))
}

const SYSTEM_PROMPT = `You are a friendly librarian of a user's personal knowledge database full of highlights that they have saved across text content across the internet.
Answer the user's given query by strictly adhering to the following rules:
- use ONLY the provided highlights as context wherever possible
- Fallback to answering based on conversation history if no relevant highlights are available
- your answer MUST be complete and thorough, but not verbose
- your response should enable the user to recall and connect ideas from their own reading
- Do not hallucinate, infer or add information beyond the provided highlights/conversation history
- Respond in a warm, natural and conversational tone.
`

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { messages: incomingMessages } = await req.json()
    const question = incomingMessages[incomingMessages.length - 1].parts.find((p: any) => p.type === 'text')?.text

    const { data: { user } } = await supabase.auth.getUser()
    const match_user_id = user?.id

    // Route the query
    let data: any[] = []
    const hasHotword = detectHotwords(question)

    if (!hasHotword) {
        // Normal RAG path
        const { embedding: query_embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: question
        })
        const { data: rpcData } = await supabase.rpc('match_highlights', { query_embedding, match_user_id, match_count: 5 })
        data = rpcData ?? []
    } else {
        // LLM classification path
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo'),
            prompt: `Classify this query into exactly one word — "meta" or "broad_specific":
            - "meta": asks about the entire knowledge base (e.g. "summarize all my highlights", "what topics have I saved?", "show me everything")
            - "broad_specific": asks broadly about a specific topic (e.g. "everything about design engineering", "all I know about sleep")

            Query: "${question}"

            Reply with only one of the two words.`
        })

        const intent = text.trim().toLowerCase()

        if (intent === 'meta') {
            const { data: allData } = await supabase.from('highlights').select('id, content, source_url').eq('user_id', match_user_id)
            data = allData ?? []
        } else {
            const { embedding: query_embedding } = await embed({
                model: openai.embedding('text-embedding-3-small'),
                value: question
            })
            const { data: rpcData } = await supabase.rpc('match_highlights', { query_embedding, match_user_id, match_count: 15 })
            data = rpcData ?? []
        }
    }

    // Build context prompt
    let CONTENT_PROMPT = ""

    const useRAG = data.length > 0 && (data[0].similarity === undefined || data[0].similarity > 0.3)

    if (useRAG) {
        const context = data.map((h: { content: string; source_url: string; id: number }) => `${h.content} - source: ${h.source_url}`)
        CONTENT_PROMPT = `Here are the relevant highlights from your knowledge base:\n${context.join('\n')}\n\nQuestion: ${question}`
    } else {
        CONTENT_PROMPT = `Question: ${question}`
    }

    const modelMessages = await convertToModelMessages(incomingMessages)
    const lastMessageWithContext = { role: 'user' as const, content: CONTENT_PROMPT }

    const result = streamText({
        model: openai('gpt-4o-mini'),
        system: SYSTEM_PROMPT,
        messages: [...modelMessages.slice(0, -1), lastMessageWithContext]
    })
    
    const sourcesHeader = useRAG
        ? encodeURIComponent(JSON.stringify(data.map((h: any) => ({ id: h.id, content: h.content, source_url: h.source_url }))))
        : '[]'

    const response = createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream })
    })
    response.headers.set('x-sources', sourcesHeader)
    return response

  } catch (err) {
    console.error('ask route error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
