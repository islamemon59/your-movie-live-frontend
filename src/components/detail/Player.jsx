import { useState, useRef } from 'react'
import { SERVERS } from '../../config.js'
import styles from '../../styles/Player.module.css'

export default function Player({ tmdbId, mediaType = 'movie', season = 1, episode = 1 }) {
  const servers = SERVERS[mediaType]
  const [activeServer, setActiveServer] = useState(0)
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef(null)

  // Build the current src URL
  const currentSrc =
    mediaType === 'movie'
      ? servers[activeServer].getUrl(tmdbId)
      : servers[activeServer].getUrl(tmdbId, season, episode)

  const handleServerChange = (index) => {
    setActiveServer(index)
    setLoading(true)
  }

  const handleIframeLoad = () => {
    // Give it 2 seconds to actually render
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className={styles.playerContainer}>
      {/* Server selector tabs — like cineby.at and way2movies */}
      <div className={styles.serverBar}>
        <span className={styles.serverLabel}>🖥 Select Server:</span>
        <div className={styles.serverTabs}>
          {servers.map((server, index) => (
            <button
              key={index}
              className={`${styles.serverTab} ${activeServer === index ? styles.activeTab : ''}`}
              onClick={() => handleServerChange(index)}
            >
              {server.name}
            </button>
          ))}
        </div>
      </div>

      {/* Player wrapper */}
      <div className={styles.playerWrapper}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            Loading {servers[activeServer].name}...
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={currentSrc}
          className={styles.iframe}
          allowFullScreen
          allow="autoplay *; fullscreen *; encrypted-media *"
          onLoad={handleIframeLoad}
        />
      </div>

      {/* Helper text */}
      <p className={styles.helperText}>
        If the current server is not working, try another server above.
      </p>
    </div>
  )
}
