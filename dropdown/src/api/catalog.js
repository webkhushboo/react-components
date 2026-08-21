const PRODUCTS_URL = 'https://dummyjson.com/products?limit=100'
const CATEGORIES_URL = 'https://dummyjson.com/products/categories'

export async function fetchProducts(signal) {
    const response = await fetch(PRODUCTS_URL, { signal })
    if (!response.ok) {
        throw new Error('Failed to load products')
    }
    const data = await response.json()
    return data.products ?? []
}

export async function fetchCategories(signal) {
    const response = await fetch(CATEGORIES_URL, { signal })
    if (!response.ok) {
        throw new Error('Failed to load categories')
    }
    const data = await response.json()
    return (Array.isArray(data) ? data : []).map((item) => {
        if (typeof item === 'string') {
            return { value: item, label: item }
        }
        return { value: item.slug ?? item.name, label: item.name ?? item.slug }
    })
}

export function fetchFilterConfig(signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'))
            return
        }

        const timer = setTimeout(() => {
            resolve({
                filters: [
                    { key: 'category', label: 'Category', visible: true },
                    { key: 'brand', label: 'Brand', visible: true },
                    { key: 'priceRange', label: 'Price range', visible: false },
                ],
            })
        }, 200)

        signal?.addEventListener('abort', () => {
            clearTimeout(timer)
            reject(new DOMException('Aborted', 'AbortError'))
        })
    })
}

export const PRICE_OPTIONS = [
    { value: 'all', label: 'All prices' },
    { value: 'under-50', label: 'Under $50' },
    { value: '50-100', label: '$50 – $100' },
    { value: 'over-100', label: 'Over $100' },
]

export const EMPTY_FILTERS = {
    category: 'all',
    brand: 'all',
    priceRange: 'all',
}

export function matchesFilters(product, filters) {
    if (filters.category && filters.category !== 'all') {
        if (product.category !== filters.category) return false
    }

    if (filters.brand && filters.brand !== 'all') {
        if (product.brand !== filters.brand) return false
    }

    if (filters.priceRange && filters.priceRange !== 'all') {
        const price = Number(product.price)
        if (filters.priceRange === 'under-50' && !(price < 50)) return false
        if (filters.priceRange === '50-100' && !(price >= 50 && price <= 100)) return false
        if (filters.priceRange === 'over-100' && !(price > 100)) return false
    }

    return true
}
