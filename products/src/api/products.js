const BASE_URL = 'https://dummyjson.com'

export async function fetchProductIds(signal) {
    const response = await fetch(`${BASE_URL}/products?limit=8&select=id`, { signal })

    if (!response.ok) {
        throw new Error('Failed to fetch product IDs')
    }

    const data = await response.json()
    return data.products.map((product) => product.id)
}

export async function fetchProductById(id, signal) {
    const response = await fetch(`${BASE_URL}/products/${id}`, { signal })

    if (!response.ok) {
        throw new Error(`Failed to fetch product ${id}`)
    }

    return response.json()
}
