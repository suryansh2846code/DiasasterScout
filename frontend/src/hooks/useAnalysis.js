import { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import MOCK_ANALYSIS from '../data/mockData.js'

const API_BASE = import.meta.env.VITE_API_URL || ''
// Empty string means use Vite proxy (/api → localhost:8000)

export default function useAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(null)
  // progress: null | { stage: string, percent: number }
  
  const pollingRef = useRef(null)

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  const analyze = useCallback(async (params) => {
    // params: { preImageUrl, postImageUrl, eventName, location }
    
    setLoading(true)
    setError(null)
    setData(null)
    setProgress({ stage: 'Submitting request...', percent: 5 })

    try {
      // Step 1: Submit the analysis job
      setProgress({ stage: 'Downloading satellite imagery...', percent: 15 })
      
      const submitResponse = await axios.post(`${API_BASE}/api/analyze`, {
        pre_image_url: params.preImageUrl,
        post_image_url: params.postImageUrl,
        event_name: params.eventName,
        location: params.location || 'Unknown location'
      })

      const result = submitResponse.data

      // Backend is sync — if status is complete, we have results immediately
      if (result.status === 'complete') {
        setProgress({ stage: 'Processing complete', percent: 100 })
        setData(result)
        setLoading(false)
        setProgress(null)
        return
      }

      // If backend returns queued (async mode), start polling
      const jobId = result.job_id
      setProgress({ stage: 'Running AI analysis...', percent: 30 })

      pollingRef.current = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${API_BASE}/api/status/${jobId}`
          )
          const status = statusResponse.data

          if (status.status === 'processing') {
            const percent = 30 + (status.progress || 0) * 0.6
            setProgress({ 
              stage: getProgressStage(status.progress), 
              percent 
            })
          }

          if (status.status === 'complete') {
            stopPolling()
            setProgress({ stage: 'Rendering damage map...', percent: 95 })
            setTimeout(() => {
              setData(status.result)
              setLoading(false)
              setProgress(null)
            }, 500) // brief pause so user sees 95%
          }

          if (status.status === 'failed') {
            stopPolling()
            throw new Error(status.error || 'Analysis failed')
          }

        } catch (pollError) {
          stopPolling()
          setError(pollError.message)
          setLoading(false)
          setProgress(null)
        }
      }, 3000) // poll every 3 seconds

    } catch (err) {
      stopPolling()
      
      // FALLBACK: if API is unreachable, use mock data in development
      if (import.meta.env.DEV && err.code === 'ERR_NETWORK') {
        console.warn('API unreachable — using mock data for development')
        setProgress({ stage: 'Loading demo data...', percent: 80 })
        setTimeout(() => {
          setData(MOCK_ANALYSIS)
          setLoading(false)
          setProgress(null)
        }, 1000)
        return
      }
      
      setError(err.response?.data?.detail || err.message || 'Analysis failed')
      setLoading(false)
      setProgress(null)
    }
  }, [stopPolling])

  // Convenience: load mock data instantly for demo/testing
  const loadDemo = useCallback(() => {
    setLoading(true)
    setProgress({ stage: 'Loading demo scenario...', percent: 50 })
    setTimeout(() => {
      setData(MOCK_ANALYSIS)
      setLoading(false)
      setProgress(null)
    }, 1500)
  }, [])

  return { data, loading, error, progress, analyze, loadDemo }
}

// Helper: map progress percentage to human-readable stage
function getProgressStage(percent) {
  if (!percent || percent < 20) return 'Preprocessing imagery...'
  if (percent < 50) return 'Running damage detection model...'
  if (percent < 80) return 'Analyzing damage patterns...'
  return 'Generating situation report...'
}
