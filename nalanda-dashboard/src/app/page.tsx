import { createClient } from "@/utils/supabase/server";
import SearchableGrid from '../components/SearchableGrid';
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
  
  return <SearchableGrid highlights={data ?? []} />

}
