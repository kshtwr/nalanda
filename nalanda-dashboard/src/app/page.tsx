import { createClient } from "@supabase/supabase-js";
import Masonry from 'react-masonry-css'

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

  const items = data.map(function(item) {
    return <div key={item.id}>{item.content} {item.source_url}</div>
  });

  return (
    <div>
      <Masonry  breakpointCols={3} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
          {items}
        </Masonry>
    </div>
  );
}
