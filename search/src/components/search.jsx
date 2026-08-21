import { useState } from 'react'
import { getSearchResults } from '../services/searchService'
import useSearch from '../hooks/useSearch'

export default function Search() {
    const { search, setSearch, results, setResults, isLoading, setIsLoading, error, setError } = useSearch()
    const handleSearch = () => {
        const controller = new AbortController()
        const timer = setTimeout(() => {
            setIsLoading(true)
            getSearchResults(search, {signal: controller.signal})
            .then(data => setResults(data.products))
            .catch(error => setError(error))
            .finally(() => {
                setIsLoading(false)
            })
        }, 1000)    
        return () => clearTimeout(timer) && controller.abort()
    }

    return (
        <div>
            <input type="text" placeholder="Search"  
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}    
            {results.length > 0 && <div>
                {results.map((result) => (
                    <div key={result.id}>
                        <img src={result.thumbnail} alt={result.title} />
                        <h3>{result.title}</h3> 
                        <p>{result.description}</p>
                        <p>{result.price}</p>
                        <p>{result.rating}</p>
                        <p>{result.stock}</p>
                    </div>
                ))}
            </div>}
            {results.length === 0 && <p>No results found</p>}
        </div>
    );
}