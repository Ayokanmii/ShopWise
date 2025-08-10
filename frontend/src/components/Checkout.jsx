import React, { useState, useContext } from 'react';
     import { useNavigate } from 'react-router-dom';
     import axios from 'axios';
     import { loadStripe } from '@stripe/stripe-js';
     import { toast } from 'react-toastify';
     import { CartContext } from './CartContext';

     const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

     const Checkout = () => {
       const { cart, setCart } = useContext(CartContext);
       const [loading, setLoading] = useState(false);
       const navigate = useNavigate();

       const handleCheckout = async () => {
         setLoading(true);
         try {
           const { data } = await axios.post('http://localhost:5000/api/payment/create-checkout-session', { cart }, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           const stripe = await stripePromise;
           await stripe.redirectToCheckout({ sessionId: data.id });
           setCart([]); // Clear cart after successful checkout
           navigate('/order-confirmation'); // Navigate to confirmation page
         } catch (err) {
           toast.error('Checkout failed. Please try again.');
         } finally {
           setLoading(false);
         }
       };

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary p-6">
           <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-white">Checkout</h2>
           <div className="max-w-2xl mx-auto bg-white dark:bg-[#2d2d2d] p-6 rounded-xl shadow-2xl">
             <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
             {cart.length === 0 ? (
               <p className="text-gray-700 dark:text-[#b0b0b0]">Your cart is empty.</p>
             ) : (
               <div>
                 {cart.map((item) => (
                   <div key={item.id} className="flex justify-between mb-2">
                     <span>{item.name} (x{item.quantity})</span>
                     <span>${(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
                 <div className="flex justify-between font-semibold mt-4">
                   <span>Total</span>
                   <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                 </div>
                 <button
                   onClick={handleCheckout}
                   className="btn-primary mt-6 w-full"
                   disabled={loading || cart.length === 0}
                 >
                   {loading ? 'Processing...' : 'Proceed to Payment'}
                 </button>
               </div>
             )}
           </div>
         </div>
       );
     };

     export default Checkout;