import React, { useState } from 'react';
     import { useNavigate } from 'react-router-dom';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const Register = () => {
       const [name, setName] = useState('');
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const navigate = useNavigate();

       const handleSubmit = async (e) => {
         e.preventDefault();
         if (!email.includes('@') || password.length < 6 || name.trim() === '') {
           toast.error('Please provide a valid email, password (6+ chars), and name');
           return;
         }
         try {
           const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
             name,
             email,
             password,
           });
           toast.success(response.data.message);
           navigate('/login');
         } catch (err) {
           console.error('Registration error:', err.response?.data);
           toast.error(err.response?.data?.error || 'Registration failed');
         }
       };

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#2d2d2d] p-8 rounded-lg shadow-md w-full max-w-md">
             <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Register</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <input
                 type="text"
                 placeholder="Name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="p-3 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-primary dark:text-white"
                 required
               />
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
                 Register
               </button>
             </form>
             <p className="mt-4 text-center text-gray-700 dark:text-[#b0b0b0]">
               Already have an account?{' '}
               <a href="/login" className="text-accent hover:underline">
                 Login
               </a>
             </p>
           </div>
         </div>
       );
     };

     export default Register;