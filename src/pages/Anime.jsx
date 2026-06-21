import { useEffect } from 'react'
import { HeroBanner } from '../components/hero/HeroBanner.jsx'
import { TrendingUp, Star } from 'lucide-react'
import { SliderSection } from '../components/slider/SliderSection.jsx'
import {
  getHeroAnimeMovies,
  getAnimeMovies,
  getAnimeTV,
  getTopRatedAnimeMovies,
  getTopRatedAnimeTV,
} from '../utils/tmdb.js'

const Anime = () => {
  useEffect(() => {
    document.title = 'Anime — yourmovielive'
  }, [])

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner fetchFn={getHeroAnimeMovies} />

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
              ANIME
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              Explore Japanese anime and animated series
            </p>
          </div>

          <SliderSection
            title="ANIME SERIES"
            icon={<TrendingUp size={20} />}
            fetchMovie={getAnimeTV}
            fetchTV={getAnimeTV}
          />

          <SliderSection
            title="ANIME MOVIES"
            icon={<Star size={20} />}
            fetchMovie={getAnimeMovies}
            fetchTV={getAnimeMovies}
          />

          <SliderSection
            title="TOP RATED ANIME MOVIES"
            icon={<Star size={20} />}
            fetchMovie={getTopRatedAnimeMovies}
            fetchTV={getTopRatedAnimeMovies}
          />

          <SliderSection
            title="TOP RATED ANIME SERIES"
            icon={<Star size={20} />}
            fetchMovie={getTopRatedAnimeTV}
            fetchTV={getTopRatedAnimeTV}
          />
        </div>
      </main>
    </>
  )
}

export default Anime
