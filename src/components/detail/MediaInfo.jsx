import { Badge } from '../ui/Badge.jsx'
import styles from '../../styles/MediaInfo.module.css'
import { IMG } from '../../config.js'

export const MediaInfo = ({ media, mediaType }) => {
  const isMovie = mediaType === 'movie'

  const formatBudget = (budget) => {
    if (!budget) return 'N/A'
    return `$${(budget / 1000000).toFixed(0)}M`
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A'
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  return (
    <div className={styles.container}>
      <div className={styles.poster}>
        <img
          src={IMG.posterLg(media.poster_path)}
          alt={media.title || media.name}
          loading="lazy"
          onError={(e) => e.target.src = '/placeholder-poster.jpg'}
        />
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{media.title || media.name}</h1>

        {media.original_title && media.original_title !== media.title && (
          <p className={styles.subtitle}>Original: {media.original_title}</p>
        )}

        {media.tagline && (
          <p className={styles.tagline}>"{media.tagline}"</p>
        )}

        {media.overview && (
          <p className={styles.overview}>{media.overview}</p>
        )}

        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <span className={styles.label}>Status</span>
            <span>{media.status || 'N/A'}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.label}>Release</span>
            <span>{media.release_date || media.first_air_date || 'N/A'}</span>
          </div>

          {isMovie && (
            <div className={styles.metaItem}>
              <span className={styles.label}>Runtime</span>
              <span>{formatRuntime(media.runtime)}</span>
            </div>
          )}

          {isMovie && (
            <div className={styles.metaItem}>
              <span className={styles.label}>Budget</span>
              <span>{formatBudget(media.budget)}</span>
            </div>
          )}

          {isMovie && media.revenue && (
            <div className={styles.metaItem}>
              <span className={styles.label}>Revenue</span>
              <span>{formatBudget(media.revenue)}</span>
            </div>
          )}

          <div className={styles.metaItem}>
            <span className={styles.label}>Language</span>
            <span>{media.original_language?.toUpperCase() || 'N/A'}</span>
          </div>
        </div>

        {media.genres && media.genres.length > 0 && (
          <div className={styles.genres}>
            {media.genres.slice(0, 5).map((genre) => (
              <Badge key={genre.id} variant="default">
                {genre.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
