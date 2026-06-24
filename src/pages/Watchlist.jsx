import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWatchlistContext } from '../context/WatchlistContext.jsx'
import { IMG } from '../config.js'
import { Trash2, ArrowLeft } from 'lucide-react'
import styles from '../styles/Watchlist.module.css'

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlistContext()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'My Watchlist — YourMovieLive'
  }, [])

  const handleRemove = (id, mediaType) => {
    removeFromWatchlist(id, mediaType)
  }

  const handleWatchlistClick = (id, mediaType) => {
    const path = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`
    navigate(path)
  }

  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => navigate('/')}
          className={styles.backBtn}
          title="Go back"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className={styles.title}>My Watchlist</h1>
        <div className={styles.badge}>{watchlist.length}</div>
      </div>

      {watchlist.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎬</div>
          <h2>Your watchlist is empty</h2>
          <p>Start adding movies and TV shows to your watchlist!</p>
          <button
            onClick={() => navigate('/search')}
            className={styles.exploreBtn}
          >
            Explore Content
          </button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {watchlist.map((item) => (
              <div key={`${item.id}-${item.mediaType}`} className={styles.card}>
                {/* Poster */}
                <div className={styles.posterContainer}>
                  {item.posterPath ? (
                    <img
                      src={IMG.poster(item.posterPath)}
                      alt={item.title}
                      className={styles.poster}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.posterPlaceholder}>
                      <span>No Image</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className={styles.overlay}>
                    <button
                      onClick={() => handleWatchlistClick(item.id, item.mediaType)}
                      className={styles.watchBtn}
                    >
                      Watch Now
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.mediaType)}
                      className={styles.removeBtn}
                      title="Remove from watchlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className={styles.info}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.mediaType}>
                    {item.mediaType === 'tv' ? 'TV Show' : 'Movie'}
                  </p>
                  <p className={styles.addedDate}>
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your entire watchlist?')) {
                clearWatchlist()
              }
            }}
            className={styles.clearAllBtn}
          >
            Clear Watchlist
          </button>
        </>
      )}
    </main>
  )
}

export default Watchlist
