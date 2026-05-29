import { createClient } from "@supabase/supabase-js";
import HighlightGrid from '../components/HighlightGrid';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function Home() {

  const { data, error } = await supabase.from('highlights')
  .select('id, content, source_url, created_at')
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
      <HighlightGrid highlights = {data}/>
    </div>
  );
}
