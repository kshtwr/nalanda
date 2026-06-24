"use client"
import {useState} from 'react';
import HighlightGrid from '../components/HighlightGrid';
import SignOutButton from '../components/SignOutButton';
import SortButton from '../components/SortButton';

export default function Search({highlights}:{highlights:any[]}){
    const [query,setQuery] = useState("");
    const filtered = highlights.filter(h => 
        h.content?.toLowerCase().includes(query.toLowerCase()) ||
        h.source_url?.toLowerCase().includes(query.toLowerCase())
    )
    
    return (
        <div className="w-full px-5 py-6">
            <div className="flex items-center">
                <input 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your bookshelf..."
                    className=" placeholder:text-gray-500 hover:placeholder:text-gray-300 hover:border-gray-500
                                border-b px-3 py-2 flex-1 mb-4 font-display text-5xl bg-transparent border-gray-300 outline-none"
                />
                <div className="mb-4 ml-4 flex-shrink-0">
                    <SortButton/>
                    
                    <SignOutButton/>
                </div>
            </div>
            <HighlightGrid highlights={filtered} />
        </div>
    )
}