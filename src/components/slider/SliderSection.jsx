import { useTMDB } from '../../hooks/useTMDB.js'
import { SliderRow } from './SliderRow.jsx'
import { Loader } from '../ui/Loader.jsx'
import { ErrorMessage } from '../ui/ErrorMessage.jsx'
import styles from '../../styles/SliderSection.module.css'

export const SliderSection = ({ title, icon, fetchMovie, fetchTV, showRank = false, isLandscape = false }) => {
  const { data, loading, error } = useTMDB(() => fetchMovie(), [fetchMovie])

  const items = data || []

  // Handle icon - can be string, component, or JSX
  const iconDisplay = typeof icon === 'string' ? <span className={styles.icon}>{icon}</span> : <span className={styles.icon}>{icon}</span>

  // Silently hide the section if data failed to load
  if (!loading && error) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {iconDisplay} {title}
        </h2>
      </div>

      {loading && <Loader />}
      {!loading && items.length > 0 && (
        <SliderRow items={items} showRank={showRank} mediaType="movie" isLandscape={isLandscape} />
      )}
    </section>
  )
}
