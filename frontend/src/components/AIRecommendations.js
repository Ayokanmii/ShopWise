import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AIRecommendations = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }
    console.log('Submitting prompt:', prompt);
    setLoading(true);
    setRecommendation('');
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('API URL:', apiUrl);
      const res = await axios.post(
        `${apiUrl}/api/recommend`,
        { prompt },
        { timeout: 60000 }
      );
      console.log('Frontend AI response:', JSON.stringify(res.data, null, 2));
      const rec = res.data.recommendation || 'No suggestions received';
      console.log('Extracted recommendation:', rec);
      setRecommendation(rec);
      toast.success('Recommendation received');
    } catch (err) {
      console.error('Frontend AI error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to get recommendation');
      toast.error(err.response?.data?.error || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Recommendation state updated:', recommendation);
  }, [recommendation]);

  // Parse recommendation string into a list for better display
  const parseRecommendations = (rec) => {
    if (!rec || rec === 'No suggestions received') return [rec];
    // Split by numbered list (e.g., "1. Item\n2. Item") or newlines
    return rec.split(/\n|\d+\.\s+/).filter(item => item.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-white mb-6 sm:mb-8 text-center">
          ShopWise AI Assistant
        </h2>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-base sm:text-lg text-gray-700 dark:text-gray-200 mb-1">
              Enter your prompt (e.g., "Suggest clothes under $20")
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Suggest a variety of clothes under $20, including specific items, brands, and stores"
              aria-describedby="prompt-label"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold disabled:bg-gray-400 dark:disabled:bg-gray-600 hover:bg-red-700 dark:hover:bg-red-500 flex items-center justify-center"
              aria-label="Get AI recommendation"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Get Recommendation'
              )}
            </button>
          </form>
          {loading && (
            <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-4" aria-live="polite">
              Generating recommendations...
            </p>
          )}
          {error && (
            <p className="text-center text-sm sm:text-base text-red-600 dark:text-red-400 mt-4" aria-live="polite">
              {error}
            </p>
          )}
          {recommendation && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-80 sm:max-h-96 overflow-y-auto" aria-live="polite">
              <h3 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-white mb-4">
                Your AI Recommendations
              </h3>
              <ul className="text-sm sm:text-base text-gray-900 dark:text-gray-200 list-disc list-inside space-y-2">
                {parseRecommendations(recommendation).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;