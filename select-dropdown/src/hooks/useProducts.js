import { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService.js';

export function useProducts() {
  const [isError, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then((data) => {
        const categories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(categories);
        setProducts(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    isLoading,
    isError,
    categories,
    products,
  };
}
