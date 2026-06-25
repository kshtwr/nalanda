export default function SortButton({ sortOrder, setSortOrder }: { 
    sortOrder: 'newest' | 'oldest', 
    setSortOrder: (order: 'newest' | 'oldest') => void 
}) {
    return (
        <button 
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer border rounded-sm px-3 py-1"
        >   
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}{' '}
            <i className={sortOrder === 'newest' ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>
            
        </button>
    )
}
