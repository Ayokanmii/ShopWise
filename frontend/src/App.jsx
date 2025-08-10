import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Welcome from './components/Welcome';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import TrackOrders from './components/TrackOrders';
import Admin from './components/Admin';
import AIRecommendations from './components/AIRecommendations'; // Updated import
import Blog from './components/Blog';
import NavBar from './components/NavBar';
import { CartProvider } from './components/CartContext';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-secondary dark:bg-primary text-primary dark:text-white">
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/products"
              element={isAuthenticated ? <ProductList /> : <Navigate to="/login" />}
            />
            <Route
              path="/cart"
              element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
            />
            <Route
              path="/track"
              element={isAuthenticated ? <TrackOrders /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={isAuthenticated ? <Admin /> : <Navigate to="/login" />}
            />
            <Route path="/assistant" element={<AIRecommendations />} /> {/* Updated to AIRecommendations, no auth */}
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;