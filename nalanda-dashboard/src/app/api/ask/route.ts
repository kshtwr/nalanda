import { createClient } from '@/utils/supabase/server'
import { openai } from '@ai-sdk/openai'
import { streamText, toUIMessageStream, createUIMessageStreamResponse, embed } from 'ai'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { messages: incomingMessages } = await req.json()
    const question = incomingMessages[incomingMessages.length - 1].parts.find((p: any) => p.type === 'text')?.text


    // 1. Embed the question
    const { embedding: query_embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: question
    })

    const { data: { user } } = await supabase.auth.getUser()
    const match_user_id = user?.id

    // 2. Vector similarity search in Supabase, filtered by user_id
    // For cross-schema functions where type inference fails, use overrideTypes:
    const { data } = await supabase
    .rpc('match_highlights', {query_embedding, match_user_id})


    // 3. Pass top matches as context to OpenAI and stream the response
    const SYSTEM_PROMPT = `You are the librarian of a user's personal knowledge database full of highlights that they have saved across text content across the internet. 
    Answer the user's given query by strictly adhering to the following rules: 
    - use ONLY the provided highlights as context 
    - your answer MUST be complete and thorough, but not verbose  
    - your response should enable the user to recall and connect ideas from their own reading 
    - If there is NO clear evidence to answer the user's question using only the provided highlights, say so explicitly. 
    - Do not hallucinate, infer or add information beyond the provided highlights.
    `

    const context = data.map((highlight: {content:string; source_url:string}) => `${highlight.content}  - source: ${highlight.source_url}`)
    
    const CONTENT_PROMPT = `
    Here are the relevant highlights from your knowledge base:
        ${context.join('\n')}
        Question: ${question}
    `

    const result = streamText({
        model: openai('gpt-4o-mini'),
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: CONTENT_PROMPT }]
    })

    return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })

}
