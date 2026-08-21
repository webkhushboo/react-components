import React from 'react'
import ProductCard from './product-card'

function ProductGrid({ products }) {
    if (products.length === 0) {
        return <p className="products-status">No products to show.</p>
    }

    return (
        <div className="products-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default React.memo(ProductGrid)
