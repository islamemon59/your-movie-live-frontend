import { createContext, useContext, useState, useEffect } from 'react'

const WatchlistContext = createContext()

const WATCHLIST_KEY = 'cinestream_watchlist'

export const WatchlistProvider = ({ children }) => {
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
      // Dispatch custom event for instant updates across tabs
      window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: watchlist }))
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

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isLoading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export const useWatchlistContext = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlistContext must be used within WatchlistProvider')
  }
  return context
}
