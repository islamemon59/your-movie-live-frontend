import { useEffect } from 'react'
import { HeroBanner } from '../components/hero/HeroBanner.jsx'
import { Star, Sparkles, Play } from 'lucide-react'
import { SliderSection } from '../components/slider/SliderSection.jsx'
import {
  getLatestKidsHero,
  getDisneyKidsMovies,
  getDisneyKidsTV,
  getKidsMovies,
  getKidsTV,
} from '../utils/tmdb.js'

const Kids = () => {
  useEffect(() => {
    document.title = 'Kids — YourMovieLive'
  }, [])

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner fetchFn={getLatestKidsHero} />

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
              KIDS & FAMILY
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              Family-friendly entertainment for all ages
            </p>
          </div>

          <SliderSection
            title="DISNEY+ KIDS"
            icon={<span style={{ fontSize: '18px', fontWeight: 'bold', color: '#113ccf' }}>D</span>}
            fetchMovie={getDisneyKidsMovies}
            fetchTV={getDisneyKidsTV}
          />

          <SliderSection
            title="KIDS MOVIES"
            icon={<Sparkles size={20} />}
            fetchMovie={getKidsMovies}
            fetchTV={getKidsMovies}
          />

          <SliderSection
            title="KIDS SHOWS"
            icon={<Play size={18} style={{ fill: 'currentColor' }} />}
            fetchMovie={getKidsTV}
            fetchTV={getKidsTV}
          />
        </div>
      </main>
    </>
  )
}

export default Kids
