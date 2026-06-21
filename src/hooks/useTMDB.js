import { useEffect, useState } from 'react'

export const useTMDB = (fetchFn, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchFn()
        if (!abortController.signal.aborted) {
          setData(result)
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err.message || 'An error occurred')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, deps)

  return { data, loading, error }
}
