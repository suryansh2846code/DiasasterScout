import { useState, useEffect } from 'react';
import MOCK_ANALYSIS from '../data/mockData';

/**
 * useAnalysis Hook
 * 
 * TODO Phase 2: replace mock with axios.post('/api/analyze', params)
 * This hook manages the state of the satellite imagery analysis.
 * Currently returns mock data after a simulated delay.
 */
export const useAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const analyze = async (params) => {
    setLoading(true);
    setError(null);
    setData(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setData(MOCK_ANALYSIS);
    setLoading(false);
  };

  useEffect(() => {
    analyze();
  }, []);

  return { data, loading, error, analyze };
};
