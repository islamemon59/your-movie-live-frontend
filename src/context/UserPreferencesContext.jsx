import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'cinestream_preferences'

const defaultState = () => ({
  genreCounts: {},
  browsed: [],       // [{id, mediaType}] — visited detail pages
  playHistory: [],   // [{id, mediaType, title, poster_path, watchedAt, season?, episode?, episodeName?}]
  searchHistory: [], // [{query, searchedAt}]
})

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    // back-compat: old key was "history"
    if (parsed.history && !parsed.browsed) {
      parsed.browsed = parsed.history
      delete parsed.history
    }
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

const save = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

const UserPreferencesContext = createContext(null)

export const UserPreferencesProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(load)

  // ── Genre tracking (for recommendations) ──────────────────
  const recordView = useCallback((item) => {
    if (!item) return
    const genreIds = item.genre_ids || (item.genres ? item.genres.map(g => g.id) : [])
    const mediaType = item.media_type || 'movie'
    setPrefs(prev => {
      const genreCounts = { ...prev.genreCounts }
      genreIds.forEach(id => { genreCounts[id] = (genreCounts[id] || 0) + 1 })
      const browsed = [
        { id: item.id, mediaType },
        ...(prev.browsed || []).filter(h => !(h.id === item.id && h.mediaType === mediaType)),
      ].slice(0, 100)
      const next = { ...prev, genreCounts, browsed }
      save(next)
      return next
    })
  }, [])

  // ── Play tracking ──────────────────────────────────────────
  const recordPlay = useCallback((item, season = null, episode = null, episodeName = null) => {
    if (!item) return
    const mediaType = item.media_type || (season ? 'tv' : 'movie')
    const entry = {
      id: item.id,
      mediaType,
      title: item.title || item.name || '',
      poster_path: item.poster_path || null,
      watchedAt: new Date().toISOString(),
      ...(season !== null && { season, episode: episode || 1, episodeName: episodeName || null }),
    }
    setPrefs(prev => {
      const playHistory = [
        entry,
        ...(prev.playHistory || []).filter(h =>
          // for TV keep multiple episodes; for movies dedupe by id
          mediaType === 'tv'
            ? !(h.id === entry.id && h.season === entry.season && h.episode === entry.episode)
            : h.id !== entry.id
        ),
      ].slice(0, 50)
      const next = { ...prev, playHistory }
      save(next)
      return next
    })
  }, [])

  // ── Search tracking ────────────────────────────────────────
  const recordSearch = useCallback((query) => {
    if (!query?.trim()) return
    const q = query.trim()
    setPrefs(prev => {
      const searchHistory = [
        { query: q, searchedAt: new Date().toISOString() },
        ...(prev.searchHistory || []).filter(h => h.query.toLowerCase() !== q.toLowerCase()),
      ].slice(0, 20)
      const next = { ...prev, searchHistory }
      save(next)
      return next
    })
  }, [])

  // ── Clear functions ────────────────────────────────────────
  const clearPlayHistory = useCallback(() => {
    setPrefs(prev => { const next = { ...prev, playHistory: [] }; save(next); return next })
  }, [])

  const clearSearchHistory = useCallback(() => {
    setPrefs(prev => { const next = { ...prev, searchHistory: [] }; save(next); return next })
  }, [])

  // ── Queries ────────────────────────────────────────────────
  const hasBrowsed = useCallback((id, mediaType) => {
    return (prefs.browsed || []).some(h => h.id === id && h.mediaType === mediaType)
  }, [prefs.browsed])

  const getPreferredGenreIds = useCallback((limit = 3) => {
    return Object.entries(prefs.genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => Number(id))
  }, [prefs.genreCounts])

  const hasPreferences = Object.keys(prefs.genreCounts).length > 0
  const hasPlayHistory = (prefs.playHistory || []).length > 0

  return (
    <UserPreferencesContext.Provider value={{
      prefs,
      recordView,
      recordPlay,
      recordSearch,
      clearPlayHistory,
      clearSearchHistory,
      hasBrowsed,
      getPreferredGenreIds,
      hasPreferences,
      hasPlayHistory,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

const noop = () => {}
const noopArr = () => []
const noopBool = () => false

export const useUserPreferences = () => {
  const ctx = useContext(UserPreferencesContext)
  if (!ctx) return {
    prefs: defaultState(),
    recordView: noop,
    recordPlay: noop,
    recordSearch: noop,
    clearPlayHistory: noop,
    clearSearchHistory: noop,
    hasBrowsed: noopBool,
    getPreferredGenreIds: noopArr,
    hasPreferences: false,
    hasPlayHistory: false,
  }
  return ctx
}
