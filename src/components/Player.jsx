import styles from '../styles/Player.module.css'
import { useState } from 'react'

export const Player = ({ src }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={styles.playerContainer}>
      {!loaded && <div className={styles.placeholder}>Loading player...</div>}
      <iframe
        src={src}
        className={styles.iframe}
        allowFullScreen
        allow="autoplay *; fullscreen *"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
