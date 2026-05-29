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

export default function HighlightGrid({ highlights }:HighlightGridProps) {
    const items = highlights.map(function(item) {
        return <div key={item.id}>{item.content}, {item.source_url}</div>
      });

    return <Masonry  
        breakpointCols={3} className="my-masonry-grid" columnClassName="my-masonry-grid_column"> 
        {items}
    </Masonry>
}

