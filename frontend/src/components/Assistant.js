import React, { useState } from 'react';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const Assistant = () => {
       const [prompt, setPrompt] = useState('');
       const [recommendation, setRecommendation] = useState('');

       const handleSubmit = async (e) => {
         e.preventDefault();
         const token = localStorage.getItem('token');
         if (!token) {
           toast.error('Please login to use AI assistant');
           return;
         }
         try {
           console.log('Sending AI request:', { prompt });
           const res = await axios.post(
             `${process.env.REACT_APP_API_URL}/api/recommend`,
             { prompt },
             { headers: { Authorization: `Bearer ${token}` } }
           );
           console.log('AI response:', res.data);
           setRecommendation(res.data.recommendation);
           toast.success('Recommendation received!');
         } catch (err) {
           console.error('AI error:', err.response?.data || err.message);
           toast.error(err.response?.data?.error || 'Could not get recommendation');
         }
       };

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary p-6">
           <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">AI Assistant</h2>
           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
             <input
               type="text"
               placeholder="Enter your query (e.g., Suggest electronics under $50)"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="p-3 rounded-lg bg-gray-100 dark:bg-[#3a3a3a] text-primary dark:text-white"
               required
             />
             <button type="submit" className="btn-primary">Get Recommendation</button>
           </form>
           {recommendation && (
             <div className="mt-4 p-4 bg-white dark:bg-[#2d2d2d] rounded">
               <h3 className="text-lg font-semibold text-primary dark:text-white">Recommendation:</h3>
               <p className="text-gray-700 dark:text-[#b0b0b0]">{recommendation}</p>
             </div>
           )}
         </div>
       );
     };

     export default Assistant;