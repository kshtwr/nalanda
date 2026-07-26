import { createClient } from '@/utils/supabase/server'
import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'



export async function POST(req: Request) {
    const supabase = await createClient()
    const { question } = await req.json()

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
    

}
