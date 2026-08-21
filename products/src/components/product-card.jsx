import React from 'react'

function ProductCard({ product }) {
    return (
        <article className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <div className="product-card-body">
                <h3>{product.title}</h3>
                <p>{product.brand} · {product.category}</p>
                <p className="product-price">${product.price}</p>
            </div>
        </article>
    )
}

export default React.memo(ProductCard)
