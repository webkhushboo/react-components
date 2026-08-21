export async function getSearchResults(search) {
    const response = await fetch (`https://dummyjson.com/products/search?q=${search}`)
    if (!response.ok) {
        throw new Error('Failed to fetch search results')
    }
    const data = await response.json()
    return data || []
}   