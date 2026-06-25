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
        return <div key={item.id} id={item.id.toString()} className="flex-col">
            <div className="metadata">{new Date(item.created_at).toLocaleDateString()}</div>
            <div className="py-1">{item.content}</div>
                <div className = "metadata flex flex-row text-left justify-between pr-2">
                    <a href = {url.toString()} target = "_blank">{getHostname(item.source_url)}</a>
                    <button onClick={()=>onDelete(item.id)}>
                        <i className="bi bi-trash text-gray-400 hover:text-red-500 cursor-pointer"></i>
                    </button>
                </div> 
        </div>
      });

    return <Masonry  
        breakpointCols={3} className="my-masonry-grid font-sans" columnClassName="my-masonry-grid_column"> 
        {items}
    </Masonry>
}

