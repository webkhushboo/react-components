import React from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from './product-grid'
import './products.css'

const ProductsDemo = () => {
    const { products, failedIds, isLoading, error, retry } = useProducts()

    return (
        <section className="products-demo">
            <h2>Product aggregation</h2>
            <p className="products-lead">
                Fetch IDs, then fetch each product in parallel, then render whatever succeeded.
            </p>

            {isLoading && <p className="products-status">Loading products…</p>}

            {error && (
                <div className="products-banner error">
                    <p>{error}</p>
                    <button type="button" className="products-retry" onClick={retry}>
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !error && failedIds.length > 0 && (
                <div className="products-banner warn">
                    <p>
                        Loaded {products.length} products. {failedIds.length} failed: {failedIds.map((item) => item.id).join(', ')}
                    </p>
                </div>
            )}

            {!isLoading && !error && <ProductGrid products={products} />}
        </section>
    )
}

export default ProductsDemo
