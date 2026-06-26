import { useState, useRef, useEffect } from 'react'
import { SERVERS } from '../../config.js'
import styles from '../../styles/Player.module.css'

// Public-facing code name so the real provider behind each server stays hidden.
const serverLabel = (index) => `Server ${String(index + 1).padStart(2, '0')}`

export default function Player({ tmdbId, mediaType = 'movie', season = 1, episode = 1 }) {
  const servers = SERVERS[mediaType]
  const [activeServer, setActiveServer] = useState(0)
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef(null)
  const wrapperRef = useRef(null)

  // When the embedded player leaves fullscreen (on Esc, the exit button, or
  // because some players auto-exit fullscreen when you pause), the browser
  // restores the page scrolled to the very top. Re-center the player instead
  // so the viewer stays exactly where they were watching.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement
      if (!fsEl) {
        // Wait for layout to settle after exiting fullscreen, then re-center.
        requestAnimationFrame(() => {
          wrapperRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' })
        })
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [])

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
          {servers.map((_server, index) => (
            <button
              key={index}
              className={`${styles.serverTab} ${activeServer === index ? styles.activeTab : ''}`}
              onClick={() => handleServerChange(index)}
            >
              {serverLabel(index)}
            </button>
          ))}
        </div>
      </div>

      {/* Guidance shown right at the server picker */}
      <p className={styles.serverHint}>
        ℹ️ If one server is not working, please try another server above.
      </p>

      {/* Player wrapper */}
      <div ref={wrapperRef} className={styles.playerWrapper}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            Loading {serverLabel(activeServer)}...
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={currentSrc}
          className={styles.iframe}
          allowFullScreen
          allow="autoplay *; fullscreen *; encrypted-media *; picture-in-picture *"
          // Hide our real domain from the embed providers. Many of them
          // hotlink-protect by Referer: on localhost the referer is
          // "localhost" (allowed), but a deployed domain gets blocked — which
          // is exactly why some servers work locally but not after deploy.
          // Sending no referer lets those servers load on the live site too.
          referrerPolicy="no-referrer"
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
