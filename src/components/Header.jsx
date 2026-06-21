import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '../styles/Header.module.css'

export const Header = () => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`)
      setSearchInput('')
    }
  }, [searchInput, navigate])

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        🎬 MovieFlix
      </div>

      <nav className={styles.nav}>
        <button
          className={styles.navLink}
          onClick={() => navigate('/search?q=action')}
        >
          Movies
        </button>
        <button
          className={styles.navLink}
          onClick={() => navigate('/search?q=drama')}
        >
          TV Shows
        </button>
      </nav>

      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies, TV shows..."
          className={styles.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
    </header>
  )
}
