import { createClient } from "@/utils/supabase/server";
import HighlightGrid from '../components/HighlightGrid';
import SignOutButton from '../components/SignOutButton';

export default async function Home() {

  const supabase =  await createClient()

  const { data, error } = await supabase.from('highlights')
  .select('id, content, source_url, created_at')
  .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching highlights:', error.message);
    return "Error fetching highlights";
  }
  
  if (!data || data.length === 0) {
    console.log('No highlights found.');
    return "No highlights found.";
  }
  
  return (
    <div>
      <div className="flex justify-between items-center pr-8 py-4">
        <div className= "font-display header">Nalanda</div>
        <SignOutButton></SignOutButton>
      </div>
      <HighlightGrid highlights = {data}/>
    </div>
  );
}
