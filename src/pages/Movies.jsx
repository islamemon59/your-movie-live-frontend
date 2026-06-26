import { useEffect } from 'react'
import { HeroBanner } from '../components/hero/HeroBanner.jsx'
import { TrendingUp, Star, Flame, Play } from 'lucide-react'
import { SliderSection } from '../components/slider/SliderSection.jsx'
import {
  getHomeHeroSlides,
  getTopRatedMovies,
  getNetflixMovies,
  getDisneyMovies,
  getPrimeMovies,
  getTop10TodayMovies,
  getUpcomingMovies,
  getLatest2026Movies,
} from '../utils/tmdb.js'

const Movies = () => {
  useEffect(() => {
    document.title = 'Movies — YourMovieLive'
  }, [])

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner fetchFn={getHomeHeroSlides} />

      {/* Main content */}
      <main style={{
        width: '100%',
        background: 'var(--bg-primary)',
        padding: '40px 8px'
      }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px', padding: '0 24px' }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '48px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              margin: '0',
              color: 'var(--text-primary)'
            }}>
              MOVIES
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              Explore our collection of movies
            </p>
          </div>

          <SliderSection
            title="TOP 10 TODAY"
            icon={<Flame size={20} />}
            fetchMovie={getTop10TodayMovies}
            fetchTV={getTop10TodayMovies}
            showRank={false}
            isLandscape={true}
          />

          <SliderSection
            title="2026 LATEST"
            icon={<Flame size={20} />}
            fetchMovie={getLatest2026Movies}
            fetchTV={getLatest2026Movies}
          />

          <SliderSection
            title="TOP RATED MOVIES"
            icon={<Star size={20} />}
            fetchMovie={getTopRatedMovies}
            fetchTV={getTopRatedMovies}
          />

          <SliderSection
            title="NETFLIX"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>N</span>}
            fetchMovie={getNetflixMovies}
            fetchTV={getNetflixMovies}
          />

          <SliderSection
            title="DISNEY+"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold', color: '#113ccf' }}>D</span>}
            fetchMovie={getDisneyMovies}
            fetchTV={getDisneyMovies}
          />

          <SliderSection
            title="PRIME VIDEO"
            icon={<Play size={18} style={{ fill: 'currentColor' }} />}
            fetchMovie={getPrimeMovies}
            fetchTV={getPrimeMovies}
          />

          <SliderSection
            title="NEW & UPCOMING"
            icon={<TrendingUp size={20} />}
            fetchMovie={getUpcomingMovies}
            fetchTV={getUpcomingMovies}
          />
        </div>
      </main>
    </>
  )
}

export default Movies
