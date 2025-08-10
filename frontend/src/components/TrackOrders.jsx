import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to track orders');
        navigate('/login');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched orders:', res.data);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Track orders error:', err.response?.data || err.message);
        if (err.response?.data?.error.includes('Token expired')) {
          toast.error('Session expired, please log in again');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          toast.error(err.response?.data?.error || 'Failed to load orders');
        }
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const fetchOrderItems = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched order items for order', orderId, ':', res.data);
      return res.data;
    } catch (err) {
      console.error('Order items error:', err.response?.data || err.message);
      toast.error('Failed to load order items');
      return [];
    }
  };

  const handlePrint = async (order) => {
    const orderItems = await fetchOrderItems(order.id);
    if (!orderItems || orderItems.length === 0) {
      toast.error('No items found for this order');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Failed to open print window');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>ShopWise Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #1a1a1a; color: #ffffff; }
            h1 { color: #e63946; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #3a3a3a; padding: 8px; text-align: left; }
            th { background-color: #e63946; color: #ffffff; }
            button { background-color: #e63946; color: #ffffff; padding: 8px 16px; border: none; cursor: pointer; }
            button:hover { background-color: #d32f3b; }
          </style>
        </head>
        <body>
          <h1>ShopWise Order Receipt</h1>
          <p>Order ID: ${order.id}</p>
          <p>Status: ${order.status}</p>
          <h2>Items</h2>
          <table>
            <tr><th>Product</th><th>Quantity</th><th>Price</th></tr>
            ${
              orderItems.map(
                (item) =>
                  `<tr><td>${item.name || 'Unknown'}</td><td>${item.quantity || 0}</td><td>$${Number(item.price || 0).toFixed(2)}</td></tr>`
              ).join('')
            }
          </table>
          <button onclick="window.print()">Print Receipt</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) return <div className="text-center text-red-600 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h2 className="text-2xl font-bold text-red-600 dark:text-white mb-6">Track Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-400">No orders found</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-md">
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <button
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handlePrint(order)}
              >
                Print Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackOrders;