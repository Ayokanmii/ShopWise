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
    <div className="min-h-screen bg-secondary dark:bg-primary p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-white">Our Products</h2>
      {loading ? (
        <p className="text-center text-gray-700 dark:text-[#b0b0b0]">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-[#b0b0b0]">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-[#2d2d2d] rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary dark:text-white">{product.name}</h3>
                <p className="text-gray-700 dark:text-[#b0b0b0] mt-1">{product.description}</p>
                <p className="text-primary dark:text-white font-bold mt-2">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-primary w-full mt-4"
                  disabled={product.stock === 0}
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