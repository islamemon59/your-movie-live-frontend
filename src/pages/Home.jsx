import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeroBanner } from '../components/hero/HeroBanner.jsx'
import { SliderSection } from '../components/slider/SliderSection.jsx'
import { BackToTop } from '../components/ui/BackToTop.jsx'
import { useUserPreferences } from '../context/UserPreferencesContext.jsx'
import { getMoviesByGenreIds } from '../utils/tmdb.js'
import { IMG } from '../config.js'
import { Flame, TrendingUp, Star, Laugh, Play, Heart, Clock } from 'lucide-react'
import {
  getTrendingMovies, getTrendingTV,
  getTopRatedMovies, getTopRatedTV,
  getPopularMovies, getPopularTV,
  getNetflixMovies, getNetflixTV,
  getDisneyMovies, getDisneyTV,
  getPrimeMovies, getPrimeTV,
  getComedyMovies, getComedyTV,
  getTop10TodayMovies, getTop10TodayTV,
  getUpcomingMovies,
  getLatest2026Movies,
  getHomeHeroSlides
} from '../utils/tmdb.js'

export const Home = () => {
  const navigate = useNavigate()
  const { hasPreferences, hasPlayHistory, getPreferredGenreIds, prefs } = useUserPreferences()
  const playHistory = prefs.playHistory || []

  const preferredGenreIds = useMemo(() => getPreferredGenreIds(3), [getPreferredGenreIds])

  // Build a stable fetch function for recommended section
  const fetchRecommended = useMemo(() => {
    if (!hasPreferences || preferredGenreIds.length === 0) return null
    return () => getMoviesByGenreIds(preferredGenreIds)
  }, [hasPreferences, preferredGenreIds.join(',')])

  useEffect(() => {
    document.title = 'YourMovieLive — Watch Movies & TV Shows'
  }, [])

  return (
    <>
      <HeroBanner fetchFn={getHomeHeroSlides} />

      <main style={{ width: '100%', padding: '0 8px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>

          {/* ── Continue Watching ── */}
          {hasPlayHistory && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 8px 12px' }}>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '22px', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} /> CONTINUE WATCHING
                </h2>
                <button
                  onClick={() => navigate('/history')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                >
                  View All History →
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', overflowY: 'hidden', padding: '4px 8px 12px', scrollbarWidth: 'none', overscrollBehaviorX: 'contain' }}>
                {playHistory.slice(0, 10).map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    onClick={() => navigate(`/${item.mediaType}/${item.id}`)}
                    style={{ flexShrink: 0, width: '130px', cursor: 'pointer' }}
                  >
                    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '2/3', background: 'var(--bg-card)' }}>
                      <img
                        src={IMG.poster(item.poster_path)}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '20px 6px 6px' }}>
                        <div style={{ background: 'var(--accent)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', display: 'inline-block' }}>
                          {item.mediaType === 'tv' && item.season ? `S${item.season}E${item.episode}` : '▶'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-secondary)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalised section — only shown once the user has watched something */}
          {fetchRecommended && (
            <SliderSection
              title="RECOMMENDED FOR YOU"
              icon={<Heart size={20} />}
              fetchMovie={fetchRecommended}
              fetchTV={getTrendingTV}
            />
          )}

          <SliderSection
            title="TOP 10 TODAY"
            icon={<Flame size={20} />}
            fetchMovie={getTop10TodayMovies}
            fetchTV={getTop10TodayTV}
            showRank={false}
            isLandscape={true}
          />

          <SliderSection
            title="NEW & UPCOMING"
            icon={<TrendingUp size={20} />}
            fetchMovie={getUpcomingMovies}
            fetchTV={getTrendingTV}
          />

          <SliderSection
            title="2026 LATEST"
            icon={<Flame size={20} />}
            fetchMovie={getLatest2026Movies}
            fetchTV={getTrendingTV}
          />

          <SliderSection
            title="TRENDING NOW"
            icon={<TrendingUp size={20} />}
            fetchMovie={getTrendingMovies}
            fetchTV={getTrendingTV}
          />

          <SliderSection
            title="NETFLIX"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>N</span>}
            fetchMovie={getNetflixMovies}
            fetchTV={getNetflixTV}
          />

          <SliderSection
            title="DISNEY+"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold', color: '#113ccf' }}>D</span>}
            fetchMovie={getDisneyMovies}
            fetchTV={getDisneyTV}
          />

          <SliderSection
            title="PRIME VIDEO"
            icon={<Play size={18} style={{ fill: 'currentColor' }} />}
            fetchMovie={getPrimeMovies}
            fetchTV={getPrimeTV}
          />

          <SliderSection
            title="TOP RATED"
            icon={<Star size={20} />}
            fetchMovie={getTopRatedMovies}
            fetchTV={getTopRatedTV}
          />

          <SliderSection
            title="POPULAR"
            icon={<TrendingUp size={20} />}
            fetchMovie={getPopularMovies}
            fetchTV={getPopularTV}
          />

          <SliderSection
            title="COMEDY"
            icon={<Laugh size={20} />}
            fetchMovie={getComedyMovies}
            fetchTV={getComedyTV}
          />

          <div style={{ height: '20px' }} />
        </div>
      </main>

      <BackToTop />
    </>
  )
}
