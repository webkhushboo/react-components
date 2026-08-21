import React from 'react';
import { useProducts } from '../hooks/useProducts.js';
import { useState } from 'react';

export default function Dropdown() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('');
  const { isLoading, isError, categories, products } = useProducts();

  // Handle submit and show product name when click category
  const handleSubmit = () => {
    setAppliedCategory(selectedCategory);
  };

  return (
    <>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => {
          return <option key={category}>{category}</option>;
        })}
      </select>

      <button type="submit" onClick={handleSubmit}>
        {' '}
        Submit{' '}
      </button>

      {isLoading && <div> Loading ... </div>}
      {isError && <div> Error ... </div>}
      {products.map(
        (product) =>
          product.category === appliedCategory &&
          product.visible && <div key={product.id}>{product.productName}</div>
      )}
    </>
  );
}
