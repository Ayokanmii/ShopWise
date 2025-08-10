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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', padding: '24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626', marginBottom: '24px' }}>
        ShopWise AI Assistant
      </h2>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '1.125rem', color: '#374151', marginBottom: '8px' }}>
            Enter your prompt (e.g., "Suggest clothes under $20")
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Suggest a variety of clothes under $20, including specific items, brands, and stores"
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#dc2626',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Generating...' : 'Get Recommendation'}
          </button>
        </form>
        {loading && <p style={{ color: '#374151', fontSize: '1rem' }}>Generating recommendations...</p>}
        {error && <p style={{ color: '#dc2626', fontSize: '1rem', marginTop: '16px' }}>{error}</p>}
        {recommendation && (
          <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626', marginBottom: '16px' }}>
              Your AI Recommendations
            </h3>
            <pre style={{ fontSize: '1rem', color: '#1f2937', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {recommendation}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;