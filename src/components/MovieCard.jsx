import styles from '../styles/MovieCard.module.css'
import { TMDB_IMG_BASE } from '../config.js'
import { useNavigate } from 'react-router-dom'

export const MovieCard = ({ id, title, posterPath, releaseDate, voteAverage, mediaType = 'movie' }) => {
  const navigate = useNavigate()
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A'
  const rating = voteAverage ? voteAverage.toFixed(1) : 'N/A'
  const posterUrl = posterPath ? `${TMDB_IMG_BASE}/w342${posterPath}` : null

  const handleClick = () => {
    navigate(`/${mediaType}/${id}`)
  }

  return (
    <div className={styles.card} data-scroll-disable onClick={handleClick}>
      <div className={styles.posterContainer}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className={styles.poster}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>No Poster</div>
        )}
        {rating !== 'N/A' && (
          <div className={styles.ratingBadge}>
            ⭐ {rating}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.year}>{year}</span>
          <span className={styles.rating}>★ {rating}</span>
        </div>
      </div>
    </div>
  )
}
