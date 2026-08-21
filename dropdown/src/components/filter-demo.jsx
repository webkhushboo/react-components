import React from 'react'
import { PRICE_OPTIONS } from '../api/catalog'
import ProductCard from './product-card'

function FilterDemoView({
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
    totalCount,
}) {
    const optionsFor = (key) => {
        if (key === 'category') return categories
        if (key === 'brand') return brandOptions
        if (key === 'priceRange') return PRICE_OPTIONS.filter((item) => item.value !== 'all')
        return []
    }

    return (
        <section className="filter-demo">
            <h2>Product filters</h2>
            <p className="filter-lead">
                Dropdowns come from the API. Hidden filters follow visibility flags.
                Results update only after Submit.
            </p>

            {isLoading && <p className="filter-meta">Loading catalog…</p>}

            {error && (
                <div className="filter-banner error">
                    <p>{error}</p>
                    <button type="button" onClick={retry}>Retry</button>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    <form className="filter-form" onSubmit={applyFilters}>
                        {visibleFilters.map((filter) => (
                            <div className="filter-field" key={filter.key}>
                                <label htmlFor={`filter-${filter.key}`}>{filter.label}</label>
                                <select
                                    id={`filter-${filter.key}`}
                                    value={draftFilters[filter.key] ?? 'all'}
                                    onChange={(event) => updateDraft(filter.key, event.target.value)}
                                >
                                    <option value="all">All</option>
                                    {optionsFor(filter.key).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        <div className="filter-actions">
                            <button className="primary" type="submit">Submit</button>
                            <button className="ghost" type="button" onClick={resetFilters}>
                                Reset
                            </button>
                        </div>
                    </form>

                    <p className="filter-meta">
                        Showing {results.length} of {totalCount}
                    </p>

                    {results.length === 0 ? (
                        <p className="results-empty">No products match these filters.</p>
                    ) : (
                        <div className="results-grid">
                            {results.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default FilterDemoView
