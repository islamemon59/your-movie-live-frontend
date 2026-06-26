import { useEffect } from 'react'
import { HeroBanner } from '../components/hero/HeroBanner.jsx'
import { Star, Flame, Play } from 'lucide-react'
import { SliderSection } from '../components/slider/SliderSection.jsx'
import {
  getLatestTVHero,
  getTopRatedTV,
  getPopularTV,
  getNetflixTV,
  getDisneyTV,
  getPrimeTV,
} from '../utils/tmdb.js'

const Shows = () => {
  useEffect(() => {
    document.title = 'TV Shows — YourMovieLive'
  }, [])

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner fetchFn={getLatestTVHero} />

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
              TV SHOWS
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              Explore our collection of TV shows and series
            </p>
          </div>

          <SliderSection
            title="TOP RATED SHOWS"
            icon={<Star size={20} />}
            fetchMovie={getTopRatedTV}
            fetchTV={getTopRatedTV}
          />

          <SliderSection
            title="POPULAR"
            icon={<Flame size={20} />}
            fetchMovie={getPopularTV}
            fetchTV={getPopularTV}
          />

          <SliderSection
            title="NETFLIX"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>N</span>}
            fetchMovie={getNetflixTV}
            fetchTV={getNetflixTV}
          />

          <SliderSection
            title="DISNEY+"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold', color: '#113ccf' }}>D</span>}
            fetchMovie={getDisneyTV}
            fetchTV={getDisneyTV}
          />

          <SliderSection
            title="PRIME VIDEO"
            icon={<Play size={18} style={{ fill: 'currentColor' }} />}
            fetchMovie={getPrimeTV}
            fetchTV={getPrimeTV}
          />
        </div>
      </main>
    </>
  )
}

export default Shows
