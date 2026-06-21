import { useMemo } from 'react'
import styles from '../styles/MovieGrid.module.css'
import { MovieCard } from './MovieCard.jsx'

export const MovieGrid = ({ items = [], title }) => {
  const memoizedItems = useMemo(() => items, [items])

  return (
    <div>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {memoizedItems.map((item) => (
          <MovieCard
            key={`${item.media_type || 'movie'}-${item.id}`}
            id={item.id}
            title={item.title || item.name}
            posterPath={item.poster_path}
            releaseDate={item.release_date || item.first_air_date}
            voteAverage={item.vote_average}
            mediaType={item.media_type || 'movie'}
          />
        ))}
      </div>
    </div>
  )
}
