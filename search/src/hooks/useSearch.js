import { useState } from 'react'

export default function useSearch() {
    const [search, setSearch] = useState('')
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    return { search, setSearch, results, setResults, isLoading, setIsLoading, error, setError }
}
