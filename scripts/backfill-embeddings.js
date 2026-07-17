import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SECRET_SUPABASE_SERVICE_ROLE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const { data, error } = await supabase.from('highlights').select('id, content, source_url')
                        .order('created_at', { ascending: false }).is('embedding', null)

                        if (error) { console.error(error); process.exit(1) }


for (const highlight of data){
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: highlight.content
    })
    const embedding = response.data[0].embedding    

    // 2. Save embedding back to the highlights row
    const { error } = await supabase
    .from('highlights')
    .update({ embedding: embedding })
    .eq('id', highlight.id)

    console.log(`Embedding saved for highlight ${highlight.id}`)
    if (error) console.error('Failed to save embedding:', error.message)
    
}


                        