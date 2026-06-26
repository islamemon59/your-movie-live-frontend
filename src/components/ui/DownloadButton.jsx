import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Download, ChevronDown, ExternalLink } from 'lucide-react'
import { DOWNLOAD_SERVERS } from '../../config.js'
import styles from '../../styles/DownloadButton.module.css'

export const DownloadButton = ({ tmdbId, title = '', mediaType = 'movie', season = 1, episode = 1 }) => {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const dropRef = useRef(null)

  const servers = DOWNLOAD_SERVERS[mediaType] || DOWNLOAD_SERVERS.movie

  const handleToggle = () => setOpen(o => !o)

  // Center the dropdown horizontally under the button, then keep it inside the
  // viewport. Measuring the real rendered width (instead of guessing) avoids
  // overflow when the CSS makes the menu wider on phones.
  useLayoutEffect(() => {
    if (!open || !btnRef.current || !dropRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const margin = 8
    const width = dropRef.current.offsetWidth
    const centered = rect.left + rect.width / 2 - width / 2
    const maxLeft = window.innerWidth - width - margin
    const left = Math.max(margin, Math.min(centered, maxLeft))
    setDropPos({ top: rect.bottom + 10, left })
  }, [open])

  useEffect(() => {
    if (!open) return
    // Ignore clicks on the trigger button itself — otherwise this mousedown
    // closes the menu a tick before the button's click handler reopens it,
    // making the dropdown impossible to close by tapping the button again.
    const close = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  const getUrl = (server) =>
    mediaType === 'tv'
      ? server.getUrl(tmdbId, title, season, episode)
      : server.getUrl(tmdbId, title)

  const episodeLabel = `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`

  return (
    <>
      <button ref={btnRef} className={styles.btn} onClick={handleToggle}>
        <Download size={16} />
        {mediaType === 'tv' ? episodeLabel : 'Download'}
        <ChevronDown size={14} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>

      {open && (
        <div
          ref={dropRef}
          className={styles.dropdown}
          style={{ top: dropPos.top, left: dropPos.left }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className={styles.dropHeader}>
            <Download size={14} />
            {mediaType === 'tv'
              ? `Download "${title}" — ${episodeLabel}`
              : `Download "${title}"`}
          </div>

          {servers.map((server, i) => (
            <a
              key={i}
              href={getUrl(server)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.server}
              onClick={() => setOpen(false)}
            >
              <div className={styles.serverLeft}>
                <span className={styles.serverName}>{server.name}</span>
                <span className={styles.serverDesc}>{server.desc}</span>
              </div>
              <div className={styles.serverRight}>
                <span className={styles.quality}>{server.quality}</span>
                <ExternalLink size={12} className={styles.extIcon} />
              </div>
            </a>
          ))}

          <p className={styles.note}>
            🔗 Each link opens the search results page. Choose your preferred quality and download.
          </p>
        </div>
      )}
    </>
  )
}
