import React, { useState } from 'react';
     import { useNavigate } from 'react-router-dom';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const Login = () => {
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const navigate = useNavigate();

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           console.log('Sending login request:', { email, password });
           const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
             email,
             password,
           });
           console.log('Login response:', res.data);
           localStorage.setItem('token', res.data.token);
           toast.success('Login successful!');
           console.log('Navigating to /');
           navigate('/');
         } catch (err) {
           console.error('Login error:', err.response?.data || err.message);
           toast.error(err.response?.data?.error || 'Login failed');
         }
       };

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#2d2d2d] p-8 rounded-lg shadow-md w-full max-w-md">
             <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Login</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <input
                 type="email"
                 placeholder="Email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="p-3 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-primary dark:text-white"
                 required
               />
               <input
                 type="password"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="p-3 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-primary dark:text-white"
                 required
               />
               <button type="submit" className="btn-primary">
                 Login
               </button>
             </form>
             <p className="mt-4 text-center text-gray-700 dark:text-[#b0b0b0]">
               Don't have an account?{' '}
               <a href="/register" className="text-accent hover:underline">
                 Register
               </a>
             </p>
             <p className="mt-2 text-center text-gray-700 dark:text-[#b0b0b0]">
               Forgot your password?{' '}
               <a href="/forgot-password" className="text-accent hover:underline">
                 Reset Password
               </a>
             </p>
           </div>
         </div>
       );
     };

     export default Login;