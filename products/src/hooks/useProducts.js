import { useCallback, useEffect, useState } from 'react'
import { fetchProductById, fetchProductIds } from '../api/products'

// DummyJSON will 404 this id. We add it on purpose so Promise.allSettled
// can show a partial failure instead of a perfect happy path.
const BROKEN_ID = 999999

export function useProducts() {
    const [products, setProducts] = useState([])
    const [failedIds, setFailedIds] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(async (signal) => {
        setIsLoading(true)
        setError(null)
        setFailedIds([])

        try {
            const ids = await fetchProductIds(signal)
            const requestIds = [...ids, BROKEN_ID]

            const results = await Promise.allSettled(
                requestIds.map((id) => fetchProductById(id, signal))
            )

            if (signal?.aborted) return

            const nextProducts = []
            const nextFailed = []

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    nextProducts.push(result.value)
                    return
                }

                nextFailed.push({
                    id: requestIds[index],
                    reason: result.reason?.message || 'Unknown error',
                })
            })

            setProducts(nextProducts)
            setFailedIds(nextFailed)
        } catch (err) {
            if (err.name === 'AbortError') return
            setProducts([])
            setFailedIds([])
            setError(err.message || 'Something went wrong')
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        load(controller.signal)

        return () => controller.abort()
    }, [load])

    const retry = useCallback(() => {
        load()
    }, [load])

    return { products, failedIds, isLoading, error, retry }
}
