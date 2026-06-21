import { useState, useMemo } from 'react'

export const EpisodeSelector = ({
  totalSeasons = 1,
  episodes = [],
  selectedSeason = 1,
  selectedEpisode = 1,
  onSeasonChange,
  onEpisodeChange
}) => {
  const seasons = useMemo(() => {
    return Array.from({ length: totalSeasons }, (_, i) => i + 1)
  }, [totalSeasons])

  const handleSeasonChange = (e) => {
    const season = parseInt(e.target.value, 10)
    onSeasonChange(season)
  }

  const handleEpisodeChange = (e) => {
    const episode = parseInt(e.target.value, 10)
    onEpisodeChange(episode)
  }

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <div style={{ flex: '1', minWidth: '200px' }}>
        <label htmlFor="season-select" style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-secondary)'
        }}>
          Season
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={handleSeasonChange}
          style={{
            width: '100%',
            padding: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              Season {season}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: '1', minWidth: '200px' }}>
        <label htmlFor="episode-select" style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-secondary)'
        }}>
          Episode
        </label>
        <select
          id="episode-select"
          value={selectedEpisode}
          onChange={handleEpisodeChange}
          style={{
            width: '100%',
            padding: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {episodes.map((episode) => (
            <option key={episode.episode_number} value={episode.episode_number}>
              E{episode.episode_number} - {episode.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
