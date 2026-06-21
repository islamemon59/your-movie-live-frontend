import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/SliderCard.module.css'
import { IMG } from '../../config.js'
import { Badge } from '../ui/Badge.jsx'
import { useUserPreferences } from '../../context/UserPreferencesContext.jsx'

export const SliderCard = ({ item, rank, mediaType = 'movie', poster_path, title, vote_average, isLandscape = false }) => {
  const navigate = useNavigate()
  const { recordView, hasBrowsed, prefs } = useUserPreferences()
  const [isHovered, setIsHovered] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const itemData = item || { poster_path, title, vote_average, id: null }
  const id = itemData.id
  const itemTitle = itemData.title || itemData.name || title
  const year = (itemData.release_date || itemData.first_air_date || '').slice(0, 4)
  const rating = itemData.vote_average ? itemData.vote_average.toFixed(1) : 'N/A'

  const seen = id ? hasBrowsed(id, mediaType) : false
  const played = id ? (prefs.playHistory || []).some(h => h.id === id && h.mediaType === mediaType) : false

  const handleClick = useCallback(() => {
    if (id) {
      recordView({ ...itemData, media_type: mediaType })
      navigate(`/${mediaType}/${id}`)
    }
  }, [navigate, id, mediaType, itemData, recordView])

  return (
    <div
      className={`${styles.cardWrapper} ${isLandscape ? styles.landscapeWrapper : ''}`}
      style={rank && !isLandscape ? { position: 'relative', marginLeft: '40px' } : {}}
    >
      {rank && !isLandscape && (
        <div className={styles.rank}>{rank}</div>
      )}

      <div
        className={`${styles.card} ${isLandscape ? styles.cardLandscape : ''} ${isHovered ? styles.hovered : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {!imageFailed ? (
          <img
            src={IMG.poster(itemData.poster_path)}
            alt={itemTitle}
            className={styles.poster}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={styles.posterPlaceholder}>
            <div className={styles.placeholderContent}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>{itemTitle}</p>
            </div>
          </div>
        )}

        {/* Already played badge */}
        {played && !isHovered && (
          <div className={styles.playedBadge} title="Already watched">▶ Watched</div>
        )}

        {/* Seen indicator (visited but not necessarily played) */}
        {seen && !played && !isHovered && (
          <div className={styles.seenBadge} title="Already visited">✓</div>
        )}

        {isHovered && (
          <div className={styles.overlay}>
            <div className={styles.content}>
              <h3 className={styles.title}>{itemTitle}</h3>
              <div className={styles.meta}>
                <Badge variant="gold">⭐ {rating}</Badge>
                {year && <span className={styles.year}>{year}</span>}
              </div>
              {(seen || played) && (
                <span className={styles.seenLabel}>{played ? '▶ Watched' : '✓ Visited'}</span>
              )}
            </div>
            <div className={styles.playIcon}>▶</div>
          </div>
        )}
      </div>
    </div>
  )
}
