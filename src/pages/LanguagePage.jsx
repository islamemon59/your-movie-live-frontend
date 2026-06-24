import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMoviesByLanguage, getTVByLanguage } from '../utils/tmdb.js'
import { SliderCard } from '../components/slider/SliderCard.jsx'
import { Loader } from '../components/ui/Loader.jsx'
import styles from '../styles/Category.module.css'

const LANGUAGE_LABELS = {
  bn: 'Bangla',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  bollywood: 'Bollywood',
}

const LanguagePage = () => {
  const { langCode, langName } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('movie')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const displayName = LANGUAGE_LABELS[langCode] || decodeURIComponent(langName || langCode)

  const fetchItems = useCallback(async (tabType, pageNum) => {
    setLoading(true)
    try {
      const fetcher = tabType === 'movie' ? getMoviesByLanguage : getTVByLanguage
      const data = await fetcher(langCode, pageNum)
      if (pageNum === 1) {
        setItems(data.results || [])
      } else {
        setItems(prev => [...prev, ...(data.results || [])])
      }
      setTotalPages(data.total_pages || 1)
    } catch {
      // keep existing items on error
    } finally {
      setLoading(false)
    }
  }, [langCode])

  useEffect(() => {
    document.title = `${displayName} Movies — YourMovieLive`
    setPage(1)
    setItems([])
    fetchItems(activeTab, 1)
  }, [langCode, activeTab, fetchItems, displayName])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchItems(activeTab, next)
  }

  const switchTab = (tab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setPage(1)
    setItems([])
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>{displayName}</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'movie' ? styles.activeTab : ''}`}
          onClick={() => switchTab('movie')}
        >
          Movies
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tv' ? styles.activeTab : ''}`}
          onClick={() => switchTab('tv')}
        >
          TV Shows
        </button>
      </div>

      <div className={styles.grid}>
        {items.map(item => (
          <SliderCard
            key={`${activeTab}-${item.id}`}
            item={item}
            mediaType={activeTab}
            fluid
          />
        ))}
      </div>

      {loading && <Loader />}

      {!loading && page < totalPages && (
        <div className={styles.loadMoreWrap}>
          <button className={styles.loadMore} onClick={loadMore}>
            Load More
          </button>
        </div>
      )}

      <div style={{ height: '40px' }} />
    </main>
  )
}

export default LanguagePage
