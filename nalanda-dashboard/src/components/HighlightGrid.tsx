"use client"
import Masonry from 'react-masonry-css';


type Highlight = {
    id: number
    content: string
    source_url: string
    created_at: string
}

type HighlightGridProps = {
    highlights : Highlight[]; 
    onDelete: (id: number) => void
}

function getHostname(url: string): string {
    try {
        return new URL(url).hostname
    } catch {
        return url
    }
}


export default function HighlightGrid({ highlights, onDelete }:HighlightGridProps) {   
    const items = highlights.map(function(item) {
        const url = new URL(item.source_url)
        url.searchParams.set('nalanda_id', item.id.toString())
        return <div key={item.id} id={item.id.toString()} className="flex-col overflow-hidden break-words">
            <div className="metadata">{new Date(item.created_at).toLocaleDateString()}</div>
            <div className="py-1">{item.content}</div>
                <div className = "metadata flex flex-row text-left justify-between pr-2 relative z-[1]">
                    <a  href = {url.toString()} target = "_blank" className="cursor-pointer hover:underline">{getHostname(item.source_url)}</a>
                    <button onClick={()=>onDelete(item.id)} className="cursor-pointer">
                        <i className="bi bi-trash text-gray-400 hover:text-red-500"></i>
                    </button>
                </div> 
        </div>
      });

    return <Masonry  
    breakpointCols={{ default: 3, 1024: 2, 640: 1 }}
    className="my-masonry-grid font-sans" columnClassName="my-masonry-grid_column"> 
        {items}
    </Masonry>
}

