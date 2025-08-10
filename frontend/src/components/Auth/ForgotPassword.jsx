import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgot-password`, { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#2d2d2d] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-primary dark:text-white"
            required
          />
          <button type="submit" className="btn-primary">
            Send Reset Link
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700 dark:text-[#b0b0b0]">
          Back to{' '}
          <a href="/login" className="text-accent hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;