import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useScrollHeader } from '../../hooks/useScrollHeader.js'
import { useWatchlistContext } from '../../context/WatchlistContext.jsx'
import { useUserPreferences } from '../../context/UserPreferencesContext.jsx'
import NavTicker from './NavTicker.jsx'
import {
  Search, Bookmark, ChevronDown, Clock, X, Menu, Trophy,
  Globe, Languages, Clapperboard,
  Zap, Compass, Sparkles, Laugh, ShieldAlert, BookOpen,
  Heart, Users, Wand2, Landmark, Ghost, Music2, Eye,
  HeartHandshake, Rocket, AlertTriangle, Sword, Sun, LayoutGrid,
} from 'lucide-react'
import { MOVIE_GENRES, searchSuggestions } from '../../utils/tmdb.js'
import { IMG } from '../../config.js'
import styles from '../../styles/Header.module.css'

const REGIONAL_LANGUAGES = [
  { code: 'bollywood', name: 'Bollywood', icon: Clapperboard },
  { code: 'hi',        name: 'Hindi',     icon: Languages    },
  { code: 'bn',        name: 'Bangla',    icon: Languages    },
  { code: 'ta',        name: 'Tamil',     icon: Languages    },
  { code: 'te',        name: 'Telugu',    icon: Languages    },
]

const GENRE_ICONS = {
  28:    Zap,
  12:    Compass,
  16:    Sparkles,
  35:    Laugh,
  80:    ShieldAlert,
  99:    BookOpen,
  18:    Heart,
  10751: Users,
  14:    Wand2,
  36:    Landmark,
  27:    Ghost,
  10402: Music2,
  9648:  Eye,
  10749: HeartHandshake,
  878:   Rocket,
  53:    AlertTriangle,
  10752: Sword,
  37:    Sun,
}

export const Header = () => {
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { scrolled } = useScrollHeader(20)
  const { watchlist } = useWatchlistContext()
  const { prefs, recordSearch, clearSearchHistory } = useUserPreferences()
  const debounceRef = useRef(null)
  const searchRef = useRef(null)
  const searchToggleRef = useRef(null)
  const inputRef = useRef(null)
  const browseRef = useRef(null)

  const recentSearches = prefs.searchHistory || []

  useEffect(() => {
    setMobileMenuOpen(false)
    setBrowseOpen(false)
    setMobileSearchOpen(false)
  }, [location.pathname])

  // Focus the input when the mobile search bar expands
  useEffect(() => {
    if (mobileSearchOpen) inputRef.current?.focus()
  }, [mobileSearchOpen])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(debounceRef.current)
    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(val.trim().length === 0 && recentSearches.length > 0)
      return
    }
    setShowSuggestions(false)
    debounceRef.current = setTimeout(async () => {
      const results = await searchSuggestions(val)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    }, 300)
  }

  const handleSearchFocus = () => {
    if (searchInput.trim().length === 0 && recentSearches.length > 0) {
      setSuggestions([])
      setShowSuggestions(true)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchInput.trim()
    if (q) {
      recordSearch(q)
      setShowSuggestions(false)
      setSuggestions([])
      setMobileSearchOpen(false)
      navigate(`/search?q=${encodeURIComponent(q)}`)
      setSearchInput('')
    }
  }

  const handleSuggestionClick = (item) => {
    const type = item.media_type === 'tv' ? 'tv' : 'movie'
    setShowSuggestions(false)
    setSuggestions([])
    setSearchInput('')
    setMobileSearchOpen(false)
    navigate(`/${type}/${item.id}`)
  }

  const handleRecentClick = (query) => {
    recordSearch(query)
    setShowSuggestions(false)
    setSearchInput('')
    setMobileSearchOpen(false)
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  useEffect(() => {
    const handler = (e) => {
      const outsideSearch = searchRef.current && !searchRef.current.contains(e.target)
      const outsideToggle = !searchToggleRef.current || !searchToggleRef.current.contains(e.target)
      if (outsideSearch) setShowSuggestions(false)
      if (outsideSearch && outsideToggle) setMobileSearchOpen(false)
      if (browseRef.current && !browseRef.current.contains(e.target)) setBrowseOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goToCategory = useCallback((genre) => {
    setBrowseOpen(false)
    setMobileMenuOpen(false)
    navigate(`/category/${genre.id}/${encodeURIComponent(genre.name)}`)
  }, [navigate])

  const goToLanguage = useCallback((lang) => {
    setBrowseOpen(false)
    setMobileMenuOpen(false)
    navigate(`/language/${lang.code}/${encodeURIComponent(lang.name)}`)
  }, [navigate])

  const showingHistory = showSuggestions && suggestions.length === 0 && searchInput.trim().length === 0

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src="/your-movie-live-logo.png" alt="YourMovieLive" className={styles.logoImg} />
        </div>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <button className={styles.navLink} onClick={() => navigate('/movies')}>Movies</button>
          <button className={styles.navLink} onClick={() => navigate('/shows')}>Shows</button>
          <button className={styles.navLink} onClick={() => navigate('/kids')}>Kids</button>
          <button className={styles.navLink} onClick={() => navigate('/anime')}>Anime</button>
          <button className={styles.navLink} onClick={() => navigate('/fifa-live')}>
            <Trophy size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            FIFA Live
          </button>

          {/* Single combined Browse dropdown */}
          <div className={styles.categoryWrap} ref={browseRef}>
            <button
              className={`${styles.navLink} ${styles.categoryBtn}`}
              onClick={() => setBrowseOpen(o => !o)}
            >
              <LayoutGrid size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
              Browse
              <ChevronDown size={14} className={`${styles.chevron} ${browseOpen ? styles.chevronOpen : ''}`} />
            </button>

            {browseOpen && (
              <div className={styles.browseDropdown}>

                {/* ── Regional Section ── */}
                <div className={styles.browseSection}>
                  <div className={styles.browseSectionHeader}>
                    <Globe size={13} />
                    Regional
                  </div>
                  <div className={styles.browseSectionGrid}>
                    {REGIONAL_LANGUAGES.map(lang => {
                      const Icon = lang.icon
                      return (
                        <button key={lang.code} className={styles.browseItem} onClick={() => goToLanguage(lang)}>
                          <Icon size={13} className={styles.browseItemIcon} />
                          {lang.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className={styles.browseDivider} />

                {/* ── Genres Section ── */}
                <div className={styles.browseSection}>
                  <div className={styles.browseSectionHeader}>
                    <Sparkles size={13} />
                    Genres
                  </div>
                  <div className={`${styles.browseSectionGrid} ${styles.browseGenreGrid}`}>
                    {MOVIE_GENRES.map(genre => {
                      const Icon = GENRE_ICONS[genre.id]
                      return (
                        <button key={genre.id} className={styles.browseItem} onClick={() => goToCategory(genre)}>
                          {Icon && <Icon size={13} className={styles.browseItemIcon} />}
                          {genre.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </nav>

        <NavTicker />

        <div className={`${styles.actions} ${mobileSearchOpen ? styles.actionsSearchOpen : ''}`}>
          {/* Mobile search toggle — expands the search bar on phones */}
          <button
            className={styles.mobileSearchToggle}
            ref={searchToggleRef}
            onClick={() => setMobileSearchOpen(o => !o)}
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
          >
            {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Search */}
          <div className={`${styles.searchWrap} ${mobileSearchOpen ? styles.searchWrapOpen : ''}`} ref={searchRef}>
            <form className={styles.searchContainer} onSubmit={handleSearch}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchInput}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                autoComplete="off"
              />
              <button type="submit" className={styles.searchButton}>
                <Search size={18} />
              </button>
            </form>

            {showSuggestions && (
              <div className={styles.suggestionBox}>
                {showingHistory && (
                  <>
                    <div className={styles.suggestionHeader}>
                      <span><Clock size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />Recent</span>
                      <button className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); clearSearchHistory(); setShowSuggestions(false) }}>
                        <X size={13} /> Clear
                      </button>
                    </div>
                    {recentSearches.slice(0, 8).map((s, i) => (
                      <button key={i} className={styles.historyItem} onClick={() => handleRecentClick(s.query)}>
                        <Clock size={14} className={styles.historyIcon} />
                        <span className={styles.historyQuery}>{s.query}</span>
                        <span className={styles.historyTime}>{formatAgo(s.searchedAt)}</span>
                      </button>
                    ))}
                  </>
                )}

                {!showingHistory && suggestions.map(item => (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    className={styles.suggestion}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <img
                      src={IMG.poster(item.poster_path)}
                      alt={item.title || item.name}
                      className={styles.suggestionImg}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    <div className={styles.suggestionInfo}>
                      <span className={styles.suggestionTitle}>{item.title || item.name}</span>
                      <span className={styles.suggestionMeta}>
                        {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                        {(item.release_date || item.first_air_date) && ` · ${(item.release_date || item.first_air_date).slice(0, 4)}`}
                      </span>
                    </div>
                    {item.vote_average > 0 && (
                      <span className={styles.suggestionRating}>⭐ {item.vote_average.toFixed(1)}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className={styles.historyBtn} onClick={() => navigate('/history')} title="Watch history">
            <Clock size={18} />
          </button>

          <button className={styles.watchlistBtn} onClick={() => navigate('/watchlist')} title="My watchlist">
            <Bookmark size={20} />
            {watchlist.length > 0 && (
              <span className={styles.watchlistBadge}>{watchlist.length}</span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.mobileLink} onClick={() => navigate('/')}>Home</button>
          <button className={styles.mobileLink} onClick={() => navigate('/movies')}>Movies</button>
          <button className={styles.mobileLink} onClick={() => navigate('/shows')}>TV Shows</button>
          <button className={styles.mobileLink} onClick={() => navigate('/kids')}>Kids</button>
          <button className={styles.mobileLink} onClick={() => navigate('/anime')}>Anime</button>
          <button className={styles.mobileLink} onClick={() => navigate('/fifa-live')}>
            <Trophy size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            FIFA Live
          </button>
          <button className={styles.mobileLink} onClick={() => navigate('/watchlist')}>My Watchlist</button>
          <button className={styles.mobileLink} onClick={() => navigate('/history')}>Watch History</button>

          <div className={styles.mobileDivider}>
            <Globe size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            Regional
          </div>
          <div className={styles.mobileGenres}>
            {REGIONAL_LANGUAGES.map(lang => {
              const Icon = lang.icon
              return (
                <button key={lang.code} className={styles.mobileGenreChip} onClick={() => goToLanguage(lang)}>
                  <Icon size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {lang.name}
                </button>
              )
            })}
          </div>

          <div className={styles.mobileDivider}>
            <Sparkles size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            Genres
          </div>
          <div className={styles.mobileGenres}>
            {MOVIE_GENRES.map(genre => {
              const Icon = GENRE_ICONS[genre.id]
              return (
                <button key={genre.id} className={styles.mobileGenreChip} onClick={() => goToCategory(genre)}>
                  {Icon && <Icon size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                  {genre.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

function formatAgo(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
