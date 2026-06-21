import { useState, useEffect } from 'react'

const WATCHLIST_KEY = 'cinestream_watchlist'

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load watchlist:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
    }
  }, [watchlist, isLoading])

  const addToWatchlist = (item) => {
    const { id, title, name, poster_path, media_type } = item
    const newItem = {
      id,
      title: title || name,
      posterPath: poster_path,
      mediaType: media_type,
      addedDate: new Date().toISOString()
    }

    setWatchlist((prev) => {
      // Check if already exists
      const exists = prev.find((w) => w.id === newItem.id && w.mediaType === newItem.mediaType)
      if (exists) return prev
      return [...prev, newItem]
    })
  }

  const removeFromWatchlist = (id, mediaType) => {
    setWatchlist((prev) => prev.filter((item) => !(item.id === id && item.mediaType === mediaType)))
  }

  const isInWatchlist = (id, mediaType) => {
    return watchlist.some((item) => item.id === id && item.mediaType === mediaType)
  }

  const clearWatchlist = () => {
    setWatchlist([])
  }

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist
  }
}
