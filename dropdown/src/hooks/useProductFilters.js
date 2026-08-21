import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    EMPTY_FILTERS,
    fetchCategories,
    fetchFilterConfig,
    fetchProducts,
    matchesFilters,
} from '../api/catalog'

export function useProductFilters() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [filterConfig, setFilterConfig] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS)
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)

    const load = useCallback(async (signal) => {
        setIsLoading(true)
        setError(null)

        try {
            const [config, categoryOptions, productList] = await Promise.all([
                fetchFilterConfig(signal),
                fetchCategories(signal),
                fetchProducts(signal),
            ])

            if (signal?.aborted) return

            setFilterConfig(config.filters ?? [])
            setCategories(categoryOptions)
            setProducts(productList)
        } catch (err) {
            if (err.name === 'AbortError') return
            setError(err.message || 'Something went wrong')
            setProducts([])
            setCategories([])
            setFilterConfig([])
        } finally {
            if (!signal?.aborted) setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        load(controller.signal)
        return () => controller.abort()
    }, [load])

    const brandOptions = useMemo(() => {
        const unique = [...new Set(products.map((item) => item.brand).filter(Boolean))]
        unique.sort((a, b) => a.localeCompare(b))
        return unique.map((brand) => ({ value: brand, label: brand }))
    }, [products])

    const visibleFilters = useMemo(
        () => filterConfig.filter((filter) => filter.visible),
        [filterConfig]
    )

    const visibleKeys = useMemo(
        () => new Set(visibleFilters.map((filter) => filter.key)),
        [visibleFilters]
    )

    const results = useMemo(() => {
        const active = {
            category: visibleKeys.has('category') ? appliedFilters.category : 'all',
            brand: visibleKeys.has('brand') ? appliedFilters.brand : 'all',
            priceRange: visibleKeys.has('priceRange') ? appliedFilters.priceRange : 'all',
        }
        return products.filter((product) => matchesFilters(product, active))
    }, [products, appliedFilters, visibleKeys])

    const updateDraft = useCallback((key, value) => {
        setDraftFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const applyFilters = useCallback((event) => {
        event.preventDefault()
        setAppliedFilters({ ...draftFilters })
    }, [draftFilters])

    const resetFilters = useCallback(() => {
        setDraftFilters(EMPTY_FILTERS)
        setAppliedFilters(EMPTY_FILTERS)
    }, [])

    const retry = useCallback(() => {
        load()
    }, [load])

    return {
        isLoading,
        error,
        retry,
        visibleFilters,
        categories,
        brandOptions,
        draftFilters,
        updateDraft,
        applyFilters,
        resetFilters,
        results,
        totalCount: products.length,
        appliedFilters,
    }
}
