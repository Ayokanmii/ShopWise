import React, { createContext, useState } from 'react';
     import { toast } from 'react-toastify';

     export const CartContext = createContext();

     export const CartProvider = ({ children }) => {
       const [cart, setCart] = useState([]);

       const addToCart = (product) => {
         setCart((prev) => {
           const existing = prev.find((item) => item.id === product.id);
           if (existing) {
             return prev.map((item) =>
               item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
             );
           }
           return [...prev, { ...product, quantity: 1 }];
         });
         toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
       };

       const removeFromCart = (productId) => {
         setCart((prev) => prev.filter((item) => item.id !== productId));
         toast.info('Item removed from cart');
       };

       return (
         <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
           {children}
         </CartContext.Provider>
       );
     };