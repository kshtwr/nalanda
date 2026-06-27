"use client"
import {useState, useEffect} from 'react';
import HighlightGrid from '../components/HighlightGrid';
import SignOutButton from '../components/SignOutButton';
import SortButton from '../components/SortButton';
import {createClient} from '@/utils/supabase/client';

const supabase = createClient();

export default function Search({highlights}:{highlights:any[]}){
    const [query,setQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [localHighlights, setLocalHighlights] = useState(highlights)
    const filtered = localHighlights.filter(h => 
        h.content?.toLowerCase().includes(query.toLowerCase()) ||
        h.source_url?.toLowerCase().includes(query.toLowerCase())
    )
    const sorted = [...filtered].sort((a, b) => 
        sortOrder === 'newest' 
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    const handleDelete = async (id: number) => {
        await supabase.from('highlights').delete().eq('id', id)
        setLocalHighlights(prev => prev.filter(h => h.id !== id))
    }

    useEffect(()=>{
        const id = new URLSearchParams(window.location.search).get('id');
        if (id) {
            const target = document.getElementById(id)
            console.log(id, target)
            target?.scrollIntoView({behavior: 'smooth', block: 'center'});
            target?.classList.add('flash');
            setTimeout(() => target?.classList.remove('flash'), 1500);
        }

    },[])
    
    
    return (
        <div className="w-full px-5 py-6">
            <div className="flex items-center">
                <input 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your bookshelf..."
                    className=" placeholder:text-gray-500 hover:placeholder:text-gray-300 hover:border-gray-500
                                border-b px-3 py-2 flex-1 mb-4 font-display text-2xl md:text-5xl bg-transparent border-gray-300 outline-none"
                />
                <div className="mb-4 ml-4 flex-shrink-0 flex flex-col items-end gap-y-1">
                    <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder}/>
                    
                    <SignOutButton/>
                </div>
            </div>
            
            {localHighlights.length === 0
                ? <p className="font-sans text-gray-500 w-full text-center mt-15">No highlights (yet)</p>
                : <HighlightGrid onDelete={handleDelete} highlights={sorted} />
            }
        </div>
    )
}