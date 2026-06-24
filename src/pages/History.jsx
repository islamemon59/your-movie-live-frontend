import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPreferences } from '../context/UserPreferencesContext.jsx'
import { IMG } from '../config.js'
import styles from '../styles/History.module.css'

const formatAgo = (isoString) => {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(isoString).toLocaleDateString()
}

export const History = () => {
  const navigate = useNavigate()
  const {
    prefs,
    clearPlayHistory,
    clearSearchHistory,
    recordSearch,
  } = useUserPreferences()

  const playHistory  = prefs.playHistory   || []
  const searchHistory = prefs.searchHistory || []
  const browsed      = prefs.browsed        || []

  useEffect(() => {
    document.title = 'History — YourMovieLive'
  }, [])

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>Your History</h1>

      {/* ── Continue Watching / Play History ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>▶ Watch History</h2>
          {playHistory.length > 0 && (
            <button className={styles.clearBtn} onClick={clearPlayHistory}>Clear all</button>
          )}
        </div>

        {playHistory.length === 0 ? (
          <p className={styles.empty}>No watch history yet. Start playing something!</p>
        ) : (
          <div className={styles.playGrid}>
            {playHistory.map((item, i) => (
              <div
                key={`${item.id}-${item.season}-${item.episode}-${i}`}
                className={styles.playCard}
                onClick={() => navigate(`/${item.mediaType}/${item.id}`)}
              >
                <div className={styles.posterWrap}>
                  <img
                    src={IMG.poster(item.poster_path)}
                    alt={item.title}
                    className={styles.poster}
                    onError={e => { e.target.style.background = 'var(--bg-card)'; e.target.style.display = 'none' }}
                  />
                  <div className={styles.playOverlay}>▶</div>
                </div>
                <div className={styles.playInfo}>
                  <p className={styles.playTitle}>{item.title}</p>
                  {item.mediaType === 'tv' && item.season && (
                    <p className={styles.playEp}>
                      S{item.season} E{item.episode}{item.episodeName ? ` · ${item.episodeName}` : ''}
                    </p>
                  )}
                  <p className={styles.playTime}>{formatAgo(item.watchedAt)}</p>
                  <span className={styles.mediaTypeBadge}>{item.mediaType === 'tv' ? 'TV' : 'Movie'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Search History ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔍 Search History</h2>
          {searchHistory.length > 0 && (
            <button className={styles.clearBtn} onClick={clearSearchHistory}>Clear all</button>
          )}
        </div>

        {searchHistory.length === 0 ? (
          <p className={styles.empty}>No search history yet.</p>
        ) : (
          <div className={styles.searchList}>
            {searchHistory.map((s, i) => (
              <button
                key={i}
                className={styles.searchItem}
                onClick={() => { recordSearch(s.query); navigate(`/search?q=${encodeURIComponent(s.query)}`) }}
              >
                <span className={styles.searchQuery}>🔍 {s.query}</span>
                <span className={styles.searchTime}>{formatAgo(s.searchedAt)}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Browsed / Visited ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>👁 Visited Titles</h2>
        </div>

        {browsed.length === 0 ? (
          <p className={styles.empty}>No browsing history yet.</p>
        ) : (
          <p className={styles.browsedCount}>
            You have visited <strong>{browsed.length}</strong> title{browsed.length !== 1 ? 's' : ''}.
            Cards you already clicked show a <span style={{ color: 'var(--accent)' }}>▶ Watched</span> or <span style={{ color: '#00b464' }}>✓</span> badge.
          </p>
        )}
      </section>

      <div style={{ height: '60px' }} />
    </main>
  )
}
