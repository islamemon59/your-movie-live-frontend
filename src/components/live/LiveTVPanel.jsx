import { useState, useEffect, useRef, useCallback } from 'react'
import Hls from 'hls.js'
import { parseM3U } from '../../utils/parseM3U.js'
import { Radio, Tv, WifiOff, ChevronRight, X, Star, Play, AlertCircle } from 'lucide-react'
import styles from '../../styles/LiveTVPanel.module.css'

// Sports M3U from iptv-org — only football channels will survive isFootball()
const SPORTS_URL = 'https://iptv-org.github.io/iptv/categories/sports.m3u'

// Priority broadcaster patterns for FIFA World Cup 2026
// Channels that match these keywords (in order) are surfaced as "Recommended"
const RECO_PATTERNS = [
  { label: 'beIN Sports',  keywords: ['bein sport'],       note: 'FIFA 2026 rights — MENA, Asia, Europe' },
  { label: 'Sky Sports',   keywords: ['sky sport'],        note: 'UK & Ireland — live World Cup matches' },
  { label: 'ESPN',         keywords: ['espn'],             note: 'USA / LatAm — official FIFA partner' },
  { label: 'Eurosport',    keywords: ['eurosport'],        note: 'Europe — live football coverage' },
  { label: 'Fox Sports',   keywords: ['fox sport'],        note: 'USA / Australia — FIFA World Cup' },
  { label: 'DAZN',         keywords: ['dazn'],             note: 'Global — live football streaming' },
  { label: 'Canal+',       keywords: ['canal+', 'canal plus'], note: 'France / Africa — FIFA 2026 rights' },
  { label: 'TNT Sports',   keywords: ['tnt sport'],        note: 'UK — international football' },
]

// Keep a channel if its group or name contains football/soccer indicators
function isFootball(ch) {
  const g = (ch.group || '').toLowerCase()
  const n = (ch.name  || '').toLowerCase()
  return (
    g.includes('football') || g.includes('soccer') ||
    n.includes('football') || n.includes('soccer')  ||
    n.includes('bein')     || n.includes('sky sport') ||
    n.includes('espn')     || n.includes('eurosport') ||
    n.includes('dazn')     || n.includes('fifa')      ||
    n.includes('fox sport')|| n.includes('canal+')    ||
    n.includes('champions league') || n.includes('premier league') ||
    n.includes('bundesliga')       || n.includes('la liga')        ||
    n.includes('serie a')          || n.includes('ligue 1')        ||
    n.includes('world cup')
  )
}

// Scan loaded channels for the first match per RECO_PATTERNS entry
function extractRecommended(channels) {
  const found = []
  const usedUrls = new Set()
  for (const pattern of RECO_PATTERNS) {
    const match = channels.find(ch => {
      const n = ch.name.toLowerCase()
      return pattern.keywords.some(kw => n.includes(kw)) && !usedUrls.has(ch.url)
    })
    if (match) {
      usedUrls.add(match.url)
      found.push({ ...match, recoLabel: pattern.label, recoNote: pattern.note })
    }
  }
  return found
}

// Logo with letter fallback — never shows an empty box
function ChannelLogo({ logo, name, size = 32 }) {
  const [imgOk, setImgOk] = useState(true)
  const initial = name?.charAt(0).toUpperCase() || '?'

  useEffect(() => { setImgOk(true) }, [logo]) // reset when channel changes

  if (!logo || !imgOk) {
    return (
      <div className={styles.logoFallback} style={{ width: size, height: size }}>
        <span>{initial}</span>
      </div>
    )
  }
  return (
    <img
      src={logo}
      alt=""
      className={styles.logoImg}
      style={{ width: size, height: size }}
      onError={() => setImgOk(false)}
    />
  )
}

// HLS / native video player
function Player({ channel, onClose }) {
  const videoRef = useRef(null)
  const hlsRef   = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!channel?.url || !videoRef.current) return
    const video = videoRef.current
    setStatus('loading')
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }

    const url = channel.url
    const isHLS = url.includes('.m3u8') || url.includes('m3u8')

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true, maxBufferLength: 30 })
      hlsRef.current = hls
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
        setStatus('playing')
      })
      hls.on(Hls.Events.ERROR, (_, d) => {
        if (d.fatal) setStatus('error')
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.play().catch(() => {})
      setStatus('playing')
    } else {
      // Try to play anyway (MP4, direct stream etc.)
      video.src = url
      video.onloadeddata = () => setStatus('playing')
      video.onerror = () => setStatus('error')
      video.play().catch(() => setStatus('error'))
    }

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    }
  }, [channel])

  return (
    <div className={styles.playerBox}>
      <div className={styles.playerHeader}>
        <div className={styles.playerMeta}>
          <ChannelLogo logo={channel.logo} name={channel.name} size={28} />
          <div>
            <div className={styles.playerName}>{channel.name}</div>
            {channel.group && <div className={styles.playerGroup}>{channel.group}</div>}
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose} title="Close player"><X size={16} /></button>
      </div>
      <div className={styles.videoWrap}>
        {status === 'loading' && (
          <div className={styles.overlay}>
            <div className={styles.spinner} />
            <span>Connecting to stream…</span>
          </div>
        )}
        {status === 'error' && (
          <div className={styles.overlay}>
            <WifiOff size={36} style={{ color: '#e50914', marginBottom: 10 }} />
            <span>Stream unavailable</span>
            <span className={styles.overlaySub}>
              This channel may be geo-blocked, require a subscription, or be temporarily offline.
              Try another channel from the list.
            </span>
          </div>
        )}
        <video
          ref={videoRef}
          className={styles.video}
          controls autoPlay playsInline
          style={{ opacity: status === 'playing' ? 1 : 0 }}
        />
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────
export default function LiveTVPanel() {
  const [channels,    setChannels]    = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [selected,    setSelected]    = useState(null)
  const [search,      setSearch]      = useState('')
  const [debSearch,   setDebSearch]   = useState('')
  const cache = useRef(null)

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 200)
    return () => clearTimeout(t)
  }, [search])

  const loadChannels = useCallback(async (force = false) => {
    if (!force && cache.current) {
      setChannels(cache.current.all)
      setRecommended(cache.current.reco)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(SPORTS_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const all      = parseM3U(await res.text())
      const football = all.filter(isFootball).slice(0, 500)
      const reco     = extractRecommended(football)
      cache.current  = { all: football, reco }
      setChannels(football)
      setRecommended(reco)
    } catch (e) {
      setError('Could not load channel list. Check your connection and retry.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadChannels() }, [loadChannels])

  const filtered = channels.filter(ch =>
    ch.name.toLowerCase().includes(debSearch.toLowerCase())
  )

  return (
    <div className={styles.panel}>

      {/* ── Recommended section ───────────────────────── */}
      <div className={styles.recoBanner}>
        <div className={styles.recoTitle}>
          <Star size={13} className={styles.recoStar} />
          Best channels for FIFA World Cup 2026
          {recommended.length === 0 && loading && (
            <span className={styles.recoLoading}>loading…</span>
          )}
        </div>

        {!loading && recommended.length === 0 && (
          <div className={styles.recoEmpty}>
            <AlertCircle size={16} />
            No major broadcasters found in the current channel list.
            Well-known channels (beIN Sports, Sky Sports, ESPN) may not be in the public feed today.
            Use the search below to find football channels manually.
          </div>
        )}

        {recommended.length > 0 && (
          <div className={styles.recoCards}>
            {recommended.map((ch, i) => (
              <button
                key={i}
                className={`${styles.recoCard} ${selected === ch ? styles.recoCardActive : ''}`}
                onClick={() => setSelected(ch)}
                title={`Watch ${ch.recoLabel}`}
              >
                <div className={styles.recoCardTop}>
                  <ChannelLogo logo={ch.logo} name={ch.recoLabel} size={36} />
                  <div className={styles.recoInfo}>
                    <div className={styles.recoLabel}>{ch.recoLabel}</div>
                    <div className={styles.recoChName}>{ch.name}</div>
                  </div>
                </div>
                <div className={styles.recoNote}>{ch.recoNote}</div>
                <div className={styles.recoPlayRow}>
                  <Play size={11} />
                  {selected === ch ? 'Now playing' : 'Watch Live'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Channel list label ────────────────────────── */}
      <div className={styles.panelLabel}>
        <Tv size={14} />
        All Football Channels
        {channels.length > 0 && (
          <span className={styles.channelCount}>{channels.length} channels</span>
        )}
      </div>

      {/* ── Two-column layout: sidebar + player ──────── */}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search football channels…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {loading && (
            <div className={styles.sidebarState}>
              <div className={styles.spinner} />
              <span>Loading football channels…</span>
            </div>
          )}
          {error && !loading && (
            <div className={styles.sidebarState}>
              <WifiOff size={28} />
              <span>{error}</span>
              <button className={styles.retryBtn} onClick={() => loadChannels(true)}>Retry</button>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className={styles.sidebarState}>No channels match your search</div>
          )}

          <ul className={styles.list}>
            {filtered.map((ch, i) => (
              <li key={`${ch.url}-${i}`}>
                <button
                  className={`${styles.channelBtn} ${selected === ch ? styles.channelActive : ''}`}
                  onClick={() => setSelected(ch)}
                >
                  <ChannelLogo logo={ch.logo} name={ch.name} size={32} />
                  <div className={styles.info}>
                    <span className={styles.chName}>{ch.name}</span>
                    {ch.country && <span className={styles.chMeta}>{ch.country}</span>}
                  </div>
                  <ChevronRight size={13} className={styles.arrow} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.main}>
          {selected ? (
            <Player channel={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className={styles.empty}>
              <Tv size={52} className={styles.emptyIcon} />
              <h3>Select a channel to watch</h3>
              <p>
                {loading
                  ? 'Loading available channels…'
                  : `${filtered.length} live football channels available`}
              </p>
              <p className={styles.emptySub}>
                Channels are sourced from the public iptv-org project.
                Some may be geo-restricted or require a subscription — if one doesn't
                work, try the next one.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
