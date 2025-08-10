import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

const NavBar = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-[#2d2d2d] shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="ShopWise Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold text-primary dark:text-white">
            ShopWise
          </span>
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="text-primary dark:text-white hover:text-accent">
            Home
          </Link>
          <Link to="/products" className="text-primary dark:text-white hover:text-accent">
            Products
          </Link>
          <Link to="/blog" className="text-primary dark:text-white hover:text-accent">
            Blog
          </Link>
          <Link to="/cart" className="text-primary dark:text-white hover:text-accent">
            Cart ({cart.length})
          </Link>
          <Link to="/track" className="text-primary dark:text-white hover:text-accent">
            Track Orders
          </Link>
          <Link to="/admin" className="text-primary dark:text-white hover:text-accent">
            Admin
          </Link>
          <Link to="/assistant" className="text-primary dark:text-white hover:text-accent">
            AI Assistant
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-primary dark:text-white hover:text-accent">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-primary dark:text-white hover:text-accent">
              Login
            </Link>
          )}
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="text-primary dark:text-white hover:text-accent"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;