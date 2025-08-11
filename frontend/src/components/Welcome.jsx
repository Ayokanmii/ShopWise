import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-white mb-4 sm:mb-6">
          Welcome to ShopWise
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
          Thank you for joining ShopWise, your premier destination for exclusive, high-quality products. Explore our curated selection, enjoy seamless shopping, and experience unmatched customer service.
        </p>
        <Link
          to="/products"
          className="w-full sm:w-auto p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-500 inline-block"
          aria-label="Start shopping"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default Welcome;