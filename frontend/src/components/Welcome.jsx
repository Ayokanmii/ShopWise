import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary dark:text-white mb-4">Welcome to ShopWise</h1>
        <p className="text-lg text-gray-700 dark:text-[#b0b0b0] mb-8">
          Thank you for joining ShopWise, your premier destination for exclusive, high-quality products. Explore our curated selection, enjoy seamless shopping, and experience unmatched customer service.
        </p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default Welcome;