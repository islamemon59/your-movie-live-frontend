import { useState } from 'react'
import { User } from 'lucide-react'
import styles from '../../styles/CastSection.module.css'
import { IMG } from '../../config.js'

export const CastSection = ({ cast }) => {
  const [failedImages, setFailedImages] = useState(new Set())

  if (!cast || cast.length === 0) return null

  const handleImageError = (actorId) => {
    setFailedImages(prev => new Set(prev).add(actorId))
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>CAST & CREW</h2>
      <div className={styles.row}>
        {cast.slice(0, 12).map((actor) => (
          <div key={actor.id} className={styles.card}>
            <div className={styles.photoContainer}>
              {!failedImages.has(actor.id) ? (
                <img
                  src={IMG.avatar(actor.profile_path)}
                  alt={actor.name}
                  loading="lazy"
                  onError={() => handleImageError(actor.id)}
                />
              ) : (
                <div className={styles.placeholderAvatar}>
                  <User size={48} />
                </div>
              )}
            </div>
            <h3 className={styles.name}>{actor.name}</h3>
            <p className={styles.character}>{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
