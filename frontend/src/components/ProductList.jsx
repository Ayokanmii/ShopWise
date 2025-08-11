import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from './CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProducts(res.data);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-white mb-6 sm:mb-8 text-center">
        Our Products
      </h2>
      {loading ? (
        <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300" aria-live="polite">
          Loading...
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300" aria-live="polite">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
            >
              <img
                src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold text-red-600 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-1">
                  {product.description || 'No description available.'}
                </p>
                <p className="text-red-600 dark:text-white font-bold mt-2">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold mt-4 hover:bg-red-700 dark:hover:bg-red-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                  disabled={product.stock === 0}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;