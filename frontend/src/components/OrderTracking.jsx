import React, { useState } from 'react';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const OrderTracking = () => {
       const [orderId, setOrderId] = useState('');
       const [order, setOrder] = useState(null);
       const [loading, setLoading] = useState(false);

       const handleTrack = async (e) => {
         e.preventDefault();
         setLoading(true);
         try {
           const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           setOrder(res.data);
           toast.success('Order found!');
         } catch (err) {
           toast.error('Order not found or invalid ID');
           setOrder(null);
         } finally {
           setLoading(false);
         }
       };

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary p-6">
           <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-white">Track Your Order</h2>
           <div className="max-w-md mx-auto bg-white dark:bg-[#2d2d2d] p-6 rounded-xl shadow-2xl">
             <form onSubmit={handleTrack}>
               <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="orderId">Order ID</label>
               <input
                 type="text"
                 id="orderId"
                 value={orderId}
                 onChange={(e) => setOrderId(e.target.value)}
                 className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                 required
               />
               <button
                 type="submit"
                 className="btn-primary mt-4 w-full"
                 disabled={loading}
               >
                 {loading ? 'Tracking...' : 'Track Order'}
               </button>
             </form>
             {order && (
               <div className="mt-6">
                 <h3 className="text-xl font-semibold">Order Details</h3>
                 <p className="text-gray-700 dark:text-[#b0b0b0]">Status: {order.status}</p>
                 <p className="text-gray-700 dark:text-[#b0b0b0]">Total: ${order.total}</p>
                 <p className="text-gray-700 dark:text-[#b0b0b0]">Date: {new Date(order.created_at).toLocaleDateString()}</p>
               </div>
             )}
           </div>
         </div>
       );
     };

     export default OrderTracking;