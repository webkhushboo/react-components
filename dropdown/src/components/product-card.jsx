import React from 'react'

function ProductCard({ product }) {
    return (
        <article className="result-card">
            <img src={product.thumbnail} alt="" />
            <div className="result-card-body">
                <h3>{product.title}</h3>
                <p>{product.brand} · {product.category}</p>
                <p className="result-price">${product.price}</p>
            </div>
        </article>
    )
}

export default React.memo(ProductCard)
