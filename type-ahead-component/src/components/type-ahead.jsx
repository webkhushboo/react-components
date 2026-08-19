import React from 'react'

const TypeAhead = ({ data = [], placeholder = 'Search here', onSelect }) => {
    const [query, setQuery] = React.useState('');

    const [filteredData , setFilteredData ] = React.useState([])
    const [isOpen , setIsOpen] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(-1)

    const containerRef = React.useRef(null)

    const fuzzyMatch = (text, query) => {
        const pattern = query.split("").map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").join(".*"));
        return new RegExp(pattern , 'i').test(text);
    }

    // filter logic

    React.useEffect (() => {
        if (query.trim() === '') {
            setFilteredData([])
            setIsOpen(false);
            return;
        }

        const results = data.filter(item => item.toLowerCase().includes(query));
        setFilteredData(results)
        setIsOpen(true)
    } , [query,data])

    // click out side logic

    React.useEffect( () => {
        const handleClickOutside = (event) => {
          if (containerRef.current.contains(event.target)){
            setIsOpen(false)
          }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return() => removeEventListener('mousedown', handleClickOutside);

    },[]);

    // keyboard navigation logic

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if(e.key === 'ArrowDown') {
            setActiveIndex(prev => prev < filteredData.length - 1 ? prev + 1 : prev)
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prev => prev > 0 ? prev - 1: prev)
        } else if (e.key === 'Enter' && activeIndex >= 0 ) {
            handleSelect(filteredData[activeIndex])
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    } 


    // selection logic

    const handleSelect = (item) => {
        setQuery(item);
        setIsOpen(false);
        setActiveIndex(-1);
        onSelect && onSelect(item)
    }

    return (
        <div className='relative w-full max-w-md'>
            <input
                type='text'
                placeholder={placeholder}
                value={query}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                    setQuery(e.target.value); 
                    setActiveIndex(-1)
                }}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent transition-all duration-200 ease-in-out'
            />

            {
                isOpen && filteredData.length > 0 && (
                    <ul className='absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 '>
                {
                    filteredData.map((item, index) => (
                        <li className='px-4 py-2 cursor-pointer transition-all duration-150' key={index}>{item}</li>
                    ))
                }
            </ul>
                )
            }
        </div>
    )
}

export default TypeAhead;
