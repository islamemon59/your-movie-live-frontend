import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTMDB } from '../hooks/useTMDB.js'
import { useUserPreferences } from '../context/UserPreferencesContext.jsx'
import { searchMulti } from '../utils/tmdb.js'
import { SliderCard } from '../components/slider/SliderCard.jsx'
import { Loader } from '../components/ui/Loader.jsx'
import { ErrorMessage } from '../components/ui/ErrorMessage.jsx'

export const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [activeTab, setActiveTab] = useState('all')
  const { recordSearch } = useUserPreferences()

  const { data: searchResults, loading, error } = useTMDB(
    () => query ? searchMulti(query) : Promise.resolve({ results: [] }),
    [query]
  )

  useEffect(() => {
    document.title = query ? `Search: ${query} — YourMovieLive` : 'Search — YourMovieLive'
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (query) recordSearch(query)  // recordSearch is stable (useCallback with no deps)
  }, [query])

  const filteredResults = useMemo(() => {
    if (!searchResults?.results) return { all: [], movie: [], tv: [] }

    const movie = searchResults.results.filter(item => item.media_type === 'movie')
    const tv = searchResults.results.filter(item => item.media_type === 'tv')

    return {
      all: searchResults.results,
      movie,
      tv
    }
  }, [searchResults])

  const currentResults = filteredResults[activeTab]

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
      {!query && (
        <div style={{
          textAlign: 'center',
          padding: '80px 32px',
          color: 'var(--text-secondary)'
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '48px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            SEARCH MOVIES & TV SHOWS
          </h2>
          <p>Use the search bar in the header to find content</p>
        </div>
      )}

      {query && (
        <>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '28px',
              textTransform: 'uppercase',
              marginBottom: '12px',
              letterSpacing: '1px'
            }}>
              SEARCH RESULTS FOR "{query}"
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Found {searchResults?.results?.length || 0} results
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '40px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px'
          }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'all' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'all' ? '3px solid var(--accent)' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all var(--transition)',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              All ({filteredResults.all.length})
            </button>
            <button
              onClick={() => setActiveTab('movie')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'movie' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'movie' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'movie' ? '3px solid var(--accent)' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all var(--transition)',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Movies ({filteredResults.movie.length})
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'tv' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'tv' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === 'tv' ? '3px solid var(--accent)' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all var(--transition)',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              TV Shows ({filteredResults.tv.length})
            </button>
          </div>

          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}

          {currentResults.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '80px 32px',
              color: 'var(--text-secondary)'
            }}>
              <h3 style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: '28px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                color: 'var(--text-primary)'
              }}>
                NO RESULTS FOUND
              </h3>
              <p>Try searching with different keywords</p>
            </div>
          )}

          {currentResults.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {currentResults.map((item) => {
                const mediaType = item.media_type === 'tv' ? 'tv' : 'movie'
                const id = item.id
                return (
                  <SliderCard
                    key={`${mediaType}-${id}`}
                    item={item}
                    mediaType={mediaType}
                  />
                )
              })}
            </div>
          )}
        </>
      )}

      <div style={{ height: '40px' }} />
    </main>
  )
}
