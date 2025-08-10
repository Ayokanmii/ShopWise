import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recommend`,
        { prompt: input },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setResponse(res.data.message);
      toast.success('Recommendation received!');
    } catch (err) {
      toast.error('Failed to get recommendation');
      setResponse('Error: Could not get recommendation');
    }
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-white">ShopWise AI Assistant</h2>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full p-3 rounded-lg bg-white dark:bg-[#2d2d2d] text-primary dark:text-white border border-gray-300 dark:border-[#b0b0b0]"
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for product recommendations (e.g., 'Suggest electronics under $50')"
          />
          <button type="submit" className="btn-primary">
            Get Recommendation
          </button>
        </form>
        {response && (
          <div className="mt-6 p-4 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-md">
            <p className="text-primary dark:text-white">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;