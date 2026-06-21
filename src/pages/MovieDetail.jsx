import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTMDB } from '../hooks/useTMDB.js'
import { useWatchlistContext } from '../context/WatchlistContext.jsx'
import { useUserPreferences } from '../context/UserPreferencesContext.jsx'
import { getMovieDetails, getMovieTrailer } from '../utils/tmdb.js'
import { ChevronLeft, Play, BookmarkPlus, Bookmark } from 'lucide-react'
import { TrailerBanner } from '../components/detail/TrailerBanner.jsx'
import { MediaInfo } from '../components/detail/MediaInfo.jsx'
import Player from '../components/detail/Player.jsx'
import { CastSection } from '../components/detail/CastSection.jsx'
import { SliderRow } from '../components/slider/SliderRow.jsx'
import { DownloadButton } from '../components/ui/DownloadButton.jsx'
import { Loader } from '../components/ui/Loader.jsx'
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx'

const MovieDetail = () => {
  const { id } = useParams()
  const [showPlayer, setShowPlayer] = useState(false)
  const { data: movie, loading, error } = useTMDB(() => getMovieDetails(id), [id])
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistContext()
  const { recordPlay } = useUserPreferences()
  const [isInList, setIsInList] = useState(false)

  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} — yourmovielive`
    }
  }, [movie])

  useEffect(() => {
    if (movie?.id) {
      setIsInList(isInWatchlist(movie.id, 'movie'))
    }
  }, [movie?.id, isInWatchlist])

  const handleWatchlistToggle = () => {
    if (isInList) {
      removeFromWatchlist(movie.id, 'movie')
      setIsInList(false)
    } else {
      addToWatchlist({ ...movie, media_type: 'movie' })
      setIsInList(true)
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />
  if (!movie) return <ErrorMessage message="Movie not found" />

  const trailerKey = getMovieTrailer(movie.videos)

  const handlePlayClick = () => {
    setShowPlayer(true)
    recordPlay({ ...movie, media_type: 'movie' })
    setTimeout(() => {
      document.getElementById('player-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 100)
  }

  return (
    <main style={{ background: 'var(--bg-primary)' }}>
      {/* TrailerBanner: hide when player is active */}
      {!showPlayer && (
        <TrailerBanner trailerKey={trailerKey} backdropPath={movie.backdrop_path}>
          <div>
            <h1 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '64px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 12px 0',
              lineHeight: '0.9'
            }}>
              {movie.title}
            </h1>
            {movie.tagline && (
              <p style={{
                fontStyle: 'italic',
                fontSize: '16px',
                color: 'var(--text-secondary)',
                margin: '0 0 16px 0'
              }}>
                {movie.tagline}
              </p>
            )}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={handlePlayClick}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--text-primary)',
                  padding: '12px 32px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'background var(--transition)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Play size={16} />
                PLAY NOW
              </button>

              <DownloadButton
                tmdbId={parseInt(id)}
                title={movie.title}
                mediaType="movie"
              />

              <button
                onClick={handleWatchlistToggle}
                style={{
                  background: isInList ? 'var(--accent)' : 'transparent',
                  color: 'var(--text-primary)',
                  padding: '12px 32px',
                  borderRadius: 'var(--radius)',
                  border: `2px solid ${isInList ? 'var(--accent)' : 'var(--text-primary)'}`,
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all var(--transition)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isInList ? <Bookmark size={16} /> : <BookmarkPlus size={16} />}
                {isInList ? 'WATCHLIST' : '+ WATCHLIST'}
              </button>
            </div>
          </div>
        </TrailerBanner>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Player — only renders when showPlayer is true */}
        {showPlayer && (
          <div style={{ margin: '0 0' }} id="player-section">
            <h2 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '28px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>
              <Play size={32} style={{ marginRight: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
              NOW PLAYING
            </h2>
            <Player tmdbId={parseInt(id)} mediaType="movie" />
            <button
              onClick={() => setShowPlayer(false)}
              style={{
                marginTop: '16px',
                background: 'transparent',
                color: 'var(--text-primary)',
                padding: '10px 24px',
                borderRadius: 'var(--radius)',
                border: '2px solid var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all var(--transition)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ChevronLeft size={20} />
              Back to Overview
            </button>
          </div>
        )}

        {movie.credits?.cast && (
          <CastSection cast={movie.credits.cast} />
        )}

        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div style={{ margin: '60px 0' }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '28px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>
              MORE LIKE THIS
            </h2>
            <SliderRow items={movie.similar.results} mediaType="movie" />
          </div>
        )}

        <div style={{ height: '40px' }} />
      </div>
    </main>
  )
}

export default MovieDetail
