import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/reset-password/${token}`, {
        password,
      });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#2d2d2d] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-primary dark:text-white"
            required
          />
          <button type="submit" className="btn-primary">
            Reset Password
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

export default ResetPassword;