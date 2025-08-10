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

       if (loading) return <div className="text-center text-primary dark:text-white">Loading...</div>;

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary p-6">
           <h2 className="text-3xl font-bold text-primary dark:text-white mb-8 text-center">Admin Dashboard</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">Products</h3>
               <table className="w-full text-left">
                 <thead>
                   <tr className="text-gray-700 dark:text-[#b0b0b0]">
                     <th>ID</th>
                     <th>Name</th>
                     <th>Price</th>
                     <th>Stock</th>
                   </tr>
                 </thead>
                 <tbody>
                   {products.map((product) => (
                     <tr key={product.id} className="border-t dark:border-[#3a3a3a]">
                       <td>{product.id}</td>
                       <td>{product.name}</td>
                       <td>${product.price.toFixed(2)}</td>
                       <td>{product.stock}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">Orders</h3>
               <table className="w-full text-left">
                 <thead>
                   <tr className="text-gray-700 dark:text-[#b0b0b0]">
                     <th>ID</th>
                     <th>User ID</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {orders.map((order) => (
                     <tr key={order.id} className="border-t dark:border-[#3a3a3a]">
                       <td>{order.id}</td>
                       <td>{order.user_id}</td>
                       <td>{order.status}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
           <button className="btn-primary mt-6" onClick={() => toast.info('Add product functionality coming soon')}>
             Add New Product
           </button>
         </div>
       );
     };

     export default Admin;