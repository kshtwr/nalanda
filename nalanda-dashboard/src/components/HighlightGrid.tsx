"use client"
import Masonry from 'react-masonry-css'

type Highlight = {
    id: number
    content: string
    source_url: string
    created_at: string
}

type HighlightGridProps = {
    highlights : Highlight[]; 
}

function getHostname(url: string): string {
    try {
        return new URL(url).hostname
    } catch {
        return url
    }
}



export default function HighlightGrid({ highlights }:HighlightGridProps) {
    const items = highlights.map(function(item) {
        return <div key={item.id} className="flex-col">
            <div className="metadata">{new Date(item.created_at).toLocaleDateString()}</div>
            {item.content} 
                <div className = "metadata flex flex-col text-right">
                    <a href = {item.source_url} target = "_blank">{getHostname(item.source_url)}</a>
                </div> 
        </div>
      });

    return <Masonry  
        breakpointCols={3} className="my-masonry-grid font-sans" columnClassName="my-masonry-grid_column"> 
        {items}
    </Masonry>
}

