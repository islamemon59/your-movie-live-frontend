import styles from '../../styles/MediaInfo.module.css'

const formatRuntime = (minutes) => {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const StarRating = ({ score }) => {
  const filled = Math.round((score / 10) * 5)
  return (
    <span className={styles.stars}>
      {'★'.repeat(filled)}{'☆'.repeat(5 - filled)}
    </span>
  )
}

export const MediaInfo = ({ media, mediaType }) => {
  const isMovie = mediaType === 'movie'
  const releaseDate = media.release_date || media.first_air_date
  const runtime = isMovie ? formatRuntime(media.runtime) : null

  return (
    <section className={styles.aboutSection}>
      <h2 className={styles.sectionTitle}>About</h2>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Rating</span>
          <div className={styles.ratingWrap}>
            <span className={styles.ratingNum}>{media.vote_average?.toFixed(1) ?? 'N/A'}</span>
            <span className={styles.ratingMax}>/10</span>
          </div>
          {media.vote_average > 0 && <StarRating score={media.vote_average} />}
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Type</span>
          <span className={styles.statValue}>{isMovie ? 'Movie' : 'TV Series'}</span>
          {media.status && <span className={styles.statusBadge}>{media.status}</span>}
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Release Date</span>
          <span className={styles.statValue}>{formatDate(releaseDate)}</span>
        </div>

        {isMovie && runtime && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Runtime</span>
            <span className={styles.statValue}>{runtime}</span>
          </div>
        )}

        {!isMovie && (
          <>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Seasons</span>
              <span className={`${styles.statValue} ${styles.bigNum}`}>{media.number_of_seasons ?? 'N/A'}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Episodes</span>
              <span className={`${styles.statValue} ${styles.bigNum}`}>{media.number_of_episodes ?? 'N/A'}</span>
            </div>
          </>
        )}

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Popularity</span>
          <span className={`${styles.statValue} ${styles.bigNum}`}>{media.popularity?.toFixed(0) ?? 'N/A'}</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Votes</span>
          <span className={styles.statValue}>{media.vote_count?.toLocaleString() ?? 'N/A'}</span>
        </div>

        {media.original_language && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Language</span>
            <span className={styles.statValue}>{media.original_language.toUpperCase()}</span>
          </div>
        )}
      </div>

      {media.overview && (
        <p className={styles.overview}>{media.overview}</p>
      )}

      {media.genres && media.genres.length > 0 && (
        <div className={styles.genreWrap}>
          {media.genres.map(g => (
            <span key={g.id} className={styles.genreChip}>{g.name}</span>
          ))}
        </div>
      )}
    </section>
  )
}
