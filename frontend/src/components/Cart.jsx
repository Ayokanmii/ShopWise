import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/checkout`,
        { cartItems: cart.map(item => ({ id: item.id, quantity: item.quantity })) }, // Send only id and quantity
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      clearCart();
      navigate('/track');
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Checkout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-red-600 dark:text-white">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
              <div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-white">{item.name}</h3>
                <p className="text-gray-700 dark:text-gray-400">${item.price} x {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleCheckout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full mt-6">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;