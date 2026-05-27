import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function Home() {

  const { data, error } = await supabase.from('highlights')
  .select('id, content, source_url')
  .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching highlights:', error.message);
    return null;
  }
  
  if (!data || data.length === 0) {
    console.log('No highlights found.');
    return null;
  }

  return (
    <div>
      <ul className = "list-disc pl-5">{data.map(({content, source_url, id}) =>
                <li key={id}> {content}, {source_url} </li>
            )}
      </ul>
    </div>
  );
}
