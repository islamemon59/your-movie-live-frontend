import { useState, useEffect, useRef, useCallback } from 'react'
import Hls from 'hls.js'
import { parseM3U } from '../utils/parseM3U.js'
import { Tv, Radio, Film, Music, Baby, Globe, Wifi, WifiOff, ChevronRight, X } from 'lucide-react'
import styles from '../styles/LiveTV.module.css'

const CATEGORIES = [
  { id: 'sports',        label: 'Sports',        icon: <span>⚽</span>,  url: 'https://iptv-org.github.io/iptv/categories/sports.m3u' },
  { id: 'news',          label: 'News',           icon: <Globe size={16}/>, url: 'https://iptv-org.github.io/iptv/categories/news.m3u' },
  { id: 'entertainment', label: 'Entertainment',  icon: <Tv size={16}/>,   url: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u' },
  { id: 'movies',        label: 'Movies',         icon: <Film size={16}/>, url: 'https://iptv-org.github.io/iptv/categories/movies.m3u' },
  { id: 'music',         label: 'Music',          icon: <Music size={16}/>, url: 'https://iptv-org.github.io/iptv/categories/music.m3u' },
  { id: 'kids',          label: 'Kids',           icon: <Baby size={16}/>, url: 'https://iptv-org.github.io/iptv/categories/kids.m3u' },
]

function LivePlayer({ channel, onClose }) {
  const videoRef = useRef(null)
  const hlsRef   = useRef(null)
  const [status, setStatus] = useState('loading') // loading | playing | error

  useEffect(() => {
    if (!channel || !videoRef.current) return
    const video = videoRef.current
    setStatus('loading')

    // Destroy previous hls instance
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }

    const isHLS = channel.url.includes('.m3u8') || channel.url.includes('m3u8')

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
      hlsRef.current = hls
      hls.loadSource(channel.url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
        setStatus('playing')
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setStatus('error')
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = channel.url
      video.play().catch(() => {})
      setStatus('playing')
    } else {
      // Try direct
      video.src = channel.url
      video.play().catch(() => setStatus('error'))
      setStatus('playing')
    }

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    }
  }, [channel])

  if (!channel) return null

  return (
    <div className={styles.playerSection}>
      <div className={styles.playerHeader}>
        <div className={styles.playerMeta}>
          {channel.logo
            ? <img src={channel.logo} alt="" className={styles.playerLogo} onError={e => { e.target.style.display = 'none' }} />
            : <Radio size={20} />}
          <div>
            <div className={styles.playerTitle}>{channel.name}</div>
            {channel.group && <div className={styles.playerGroup}>{channel.group}</div>}
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
      </div>

      <div className={styles.videoWrap}>
        {status === 'loading' && (
          <div className={styles.statusOverlay}>
            <div className={styles.spinner} />
            <span>Connecting to stream…</span>
          </div>
        )}
        {status === 'error' && (
          <div className={styles.statusOverlay}>
            <WifiOff size={40} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <span>Stream unavailable</span>
            <span className={styles.statusSub}>This channel may be geo-restricted or offline. Try another one.</span>
          </div>
        )}
        <video
          ref={videoRef}
          className={styles.video}
          controls
          autoPlay
          playsInline
          style={{ opacity: status === 'playing' ? 1 : 0 }}
        />
      </div>
    </div>
  )
}

export default function LiveTV() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [channels, setChannels] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState('')
  const cache = useRef({})

  useEffect(() => {
    document.title = 'Live TV — yourmovielive'
  }, [])

  const loadCategory = useCallback(async (cat) => {
    if (cache.current[cat.id]) {
      setChannels(cache.current[cat.id])
      return
    }
    setLoading(true)
    setError(null)
    setChannels([])
    try {
      const res = await fetch(cat.url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      const parsed = parseM3U(text).slice(0, 300) // cap at 300 for perf
      cache.current[cat.id] = parsed
      setChannels(parsed)
    } catch (e) {
      setError('Failed to load channels. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setSelected(null)
    setSearch('')
    loadCategory(activeCategory)
  }, [activeCategory, loadCategory])

  const filtered = channels.filter(ch =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleRow}>
          <Wifi size={28} className={styles.liveIcon} />
          <h1 className={styles.pageTitle}>Live TV</h1>
          <span className={styles.liveBadge}>FREE</span>
        </div>
        <p className={styles.pageSubtitle}>
          Thousands of free live channels powered by the open-source iptv-org project
        </p>
      </div>

      {/* Category tabs */}
      <div className={styles.tabs}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.tab} ${activeCategory.id === cat.id ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Channel list */}
        <aside className={styles.sidebar}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search channels…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {loading && (
            <div className={styles.sidebarState}>
              <div className={styles.spinner} />
              Loading channels…
            </div>
          )}

          {error && (
            <div className={styles.sidebarState}>
              <WifiOff size={32} />
              <span>{error}</span>
              <button className={styles.retryBtn} onClick={() => loadCategory(activeCategory)}>Retry</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.sidebarState}>No channels found</div>
          )}

          <ul className={styles.channelList}>
            {filtered.map((ch, i) => (
              <li key={i}>
                <button
                  className={`${styles.channelBtn} ${selected === ch ? styles.activeChannel : ''}`}
                  onClick={() => setSelected(ch)}
                >
                  <div className={styles.channelLogo}>
                    {ch.logo
                      ? <img src={ch.logo} alt="" onError={e => { e.target.style.display = 'none' }} />
                      : <Radio size={18} />}
                  </div>
                  <div className={styles.channelInfo}>
                    <span className={styles.channelName}>{ch.name}</span>
                    {ch.country && <span className={styles.channelMeta}>{ch.country}</span>}
                  </div>
                  <ChevronRight size={14} className={styles.channelArrow} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Player / empty state */}
        <main className={styles.main}>
          {selected ? (
            <LivePlayer channel={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className={styles.emptyPlayer}>
              <Tv size={64} className={styles.emptyIcon} />
              <h2>Select a channel to watch</h2>
              <p>
                Browse {filtered.length} free {activeCategory.label.toLowerCase()} channels
                and click one to start streaming.
              </p>
              <p className={styles.disclaimer}>
                Streams are sourced from the public iptv-org repository.
                Some channels may be geo-restricted or temporarily offline.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
