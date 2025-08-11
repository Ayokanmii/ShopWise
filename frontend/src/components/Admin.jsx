import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login as admin');
        return;
      }
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Admin error:', err.response?.data || err.message);
        toast.error('Failed to load admin data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="text-center text-sm sm:text-base text-red-600 dark:text-white" aria-live="polite">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-white mb-6 sm:mb-8 text-center">
          Admin Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-white mb-4">
              Products
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="text-gray-700 dark:text-gray-300">
                    <th scope="col" className="p-2 sm:p-3">ID</th>
                    <th scope="col" className="p-2 sm:p-3">Name</th>
                    <th scope="col" className="p-2 sm:p-3">Price</th>
                    <th scope="col" className="p-2 sm:p-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t dark:border-gray-600">
                      <td className="p-2 sm:p-3">{product.id}</td>
                      <td className="p-2 sm:p-3">{product.name}</td>
                      <td className="p-2 sm:p-3">${product.price.toFixed(2)}</td>
                      <td className="p-2 sm:p-3">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-white mb-4">
              Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="text-gray-700 dark:text-gray-300">
                    <th scope="col" className="p-2 sm:p-3">ID</th>
                    <th scope="col" className="p-2 sm:p-3">User ID</th>
                    <th scope="col" className="p-2 sm:p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t dark:border-gray-600">
                      <td className="p-2 sm:p-3">{order.id}</td>
                      <td className="p-2 sm:p-3">{order.user_id}</td>
                      <td className="p-2 sm:p-3">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button
          className="w-full sm:w-auto p-3 bg-red-600 text-white rounded-lg font-semibold mt-4 sm:mt-6 hover:bg-red-700 dark:hover:bg-red-500"
          onClick={() => toast.info('Add product functionality coming soon')}
          aria-label="Add new product"
        >
          Add New Product
        </button>
      </div>
    </div>
  );
};

export default Admin;