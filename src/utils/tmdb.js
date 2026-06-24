import { TMDB_API_KEY, TMDB_BASE } from '../config.js'

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.append('api_key', TMDB_API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  return url.toString()
}

const handleError = (error) => {
  console.error('TMDB API Error:', error)
  throw new Error(error?.message || 'Failed to fetch data from TMDB')
}

// ─── MOVIES ───────────────────────────────────────────────

export const getTrendingMovies = async () => {
  try {
    const url = buildUrl('/trending/movie/day')
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getTopRatedMovies = async () => {
  try {
    const url = buildUrl('/movie/top_rated', { page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getPopularMovies = async () => {
  try {
    const url = buildUrl('/movie/popular', { page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getNetflixMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_watch_providers: '8',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getDisneyMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_watch_providers: '337',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getPrimeMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_watch_providers: '10',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getComedyMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_genres: '35',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getTop10TodayMovies = async () => {
  try {
    const url = buildUrl('/trending/movie/day')
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }))
  } catch (error) {
    handleError(error)
  }
}

export const getUpcomingMovies = async () => {
  try {
    const url = buildUrl('/movie/upcoming', { page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getLatest2026Movies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      primary_release_year: '2026',
      sort_by: 'release_date.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getHighRated2026Movies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      primary_release_year: '2026',
      sort_by: 'vote_average.desc',
      'vote_count.gte': 50,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 20)
  } catch (error) {
    handleError(error)
  }
}

export const getMovieDetails = async (movieId) => {
  try {
    const url = buildUrl(`/movie/${movieId}`, {
      append_to_response: 'videos,credits,similar,watch/providers'
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    handleError(error)
  }
}

export const getMovieTrailer = (videos) => {
  if (!videos || !videos.results) return null
  
  // Try official trailer first
  let trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official)
  if (trailer) return trailer.key
  
  // Try any trailer
  trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  if (trailer) return trailer.key
  
  // Try teaser
  const teaser = videos.results.find(v => v.type === 'Teaser' && v.site === 'YouTube')
  if (teaser) return teaser.key
  
  // Return first video if available
  if (videos.results.length > 0 && videos.results[0].site === 'YouTube') {
    return videos.results[0].key
  }
  
  return null
}

// ─── TV SHOWS ─────────────────────────────────────────────

export const getTrendingTV = async () => {
  try {
    const url = buildUrl('/trending/tv/day')
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10)
  } catch (error) {
    handleError(error)
  }
}

export const getTopRatedTV = async () => {
  try {
    const url = buildUrl('/tv/top_rated', { page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10)
  } catch (error) {
    handleError(error)
  }
}

export const getPopularTV = async () => {
  try {
    const url = buildUrl('/tv/popular', { page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10)
  } catch (error) {
    handleError(error)
  }
}

export const getNetflixTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_watch_providers: '8',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10)
  } catch (error) {
    handleError(error)
  }
}

export const getDisneyTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_watch_providers: '337',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10)
  } catch (error) {
    handleError(error)
  }
}

export const getPrimeTV = async () => {
  // Try provider 119 (Prime Video), fall back to provider 9 (Amazon Video)
  for (const providerId of ['119', '9']) {
    try {
      const url = buildUrl('/discover/tv', {
        with_watch_providers: providerId,
        watch_region: 'US',
        sort_by: 'popularity.desc',
        include_adult: 'false',
        page: 1
      })
      const response = await fetch(url)
      if (!response.ok) continue
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        return data.results.slice(0, 25)
      }
    } catch (_) {
      continue
    }
  }
  return []
}

export const getComedyTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_genres: '35',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10)
  } catch (error) {
    handleError(error)
  }
}

export const getTop10TodayTV = async () => {
  try {
    const url = buildUrl('/trending/tv/day')
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 10).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }))
  } catch (error) {
    handleError(error)
  }
}

export const getTVDetails = async (tvId) => {
  try {
    const url = buildUrl(`/tv/${tvId}`, {
      append_to_response: 'videos,credits,similar,watch/providers'
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    handleError(error)
  }
}

export const getTVSeason = async (tvId, seasonNumber) => {
  try {
    const url = buildUrl(`/tv/${tvId}/season/${seasonNumber}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    handleError(error)
  }
}

// ─── HERO ─────────────────────────────────────────────────

export const getHeroContent = async () => {
  try {
    const url = buildUrl('/movie/top_rated', { page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    
    // Get 5 random top-rated movies
    const shuffled = data.results.sort(() => Math.random() - 0.5).slice(0, 5)
    
    const heroSlides = await Promise.all(
      shuffled.map(async (movie) => {
        const details = await getMovieDetails(movie.id)
        const trailerKey = getMovieTrailer(details.videos)
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          trailerKey,
          genres: details.genres || []
        }
      })
    )
    
    return heroSlides
  } catch (error) {
    handleError(error)
  }
}

// Hero for Movies page
export const getHeroTrendingMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      sort_by: 'popularity.desc',
      'vote_count.gte': 500,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    
    const shuffled = data.results.sort(() => Math.random() - 0.5).slice(0, 5)
    
    const heroSlides = await Promise.all(
      shuffled.map(async (movie) => {
        const details = await getMovieDetails(movie.id)
        const trailerKey = getMovieTrailer(details.videos)
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          trailerKey,
          genres: details.genres || []
        }
      })
    )
    
    return heroSlides
  } catch (error) {
    handleError(error)
  }
}

// Hero for Shows page
export const getHeroTrendingTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      sort_by: 'popularity.desc',
      'vote_count.gte': 500,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    
    const shuffled = data.results.sort(() => Math.random() - 0.5).slice(0, 5)
    
    const heroSlides = await Promise.all(
      shuffled.map(async (tv) => {
        const details = await getTVDetails(tv.id)
        const trailerKey = getMovieTrailer(details.videos)
        return {
          id: tv.id,
          title: tv.name,
          overview: tv.overview,
          backdrop_path: tv.backdrop_path,
          vote_average: tv.vote_average,
          release_date: tv.first_air_date,
          trailerKey,
          genres: details.genres || []
        }
      })
    )
    
    return heroSlides
  } catch (error) {
    handleError(error)
  }
}

// Hero for Kids page
export const getHeroKidsMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_genres: '16,10751',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    
    const shuffled = data.results.sort(() => Math.random() - 0.5).slice(0, 5)
    
    const heroSlides = await Promise.all(
      shuffled.map(async (movie) => {
        const details = await getMovieDetails(movie.id)
        const trailerKey = getMovieTrailer(details.videos)
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          trailerKey,
          genres: details.genres || []
        }
      })
    )
    
    return heroSlides
  } catch (error) {
    handleError(error)
  }
}

// Hero for Anime page
export const getHeroAnimeMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    
    const shuffled = data.results.sort(() => Math.random() - 0.5).slice(0, 5)
    
    const heroSlides = await Promise.all(
      shuffled.map(async (movie) => {
        const details = await getMovieDetails(movie.id)
        const trailerKey = getMovieTrailer(details.videos)
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          trailerKey,
          genres: details.genres || []
        }
      })
    )
    
    return heroSlides
  } catch (error) {
    handleError(error)
  }
}

// ─── SEARCH ───────────────────────────────────────────────

export const searchMulti = async (query, page = 1) => {
  try {
    const url = buildUrl('/search/multi', { query, page })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    
    // Filter to only movie and tv types
    data.results = data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    )
    
    return data
  } catch (error) {
    handleError(error)
  }
}

// ─── KIDS CONTENT ─────────────────────────────────────────

export const getDisneyKidsMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_watch_providers: '337',
      with_genres: '16,10751',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getDisneyKidsTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_watch_providers: '337',
      with_genres: '16,10751',
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getAnimationMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_genres: '16',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getKidsMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_genres: '10751',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getKidsTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_genres: '10751',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

// ─── ANIME ───────────────────────────────────────────────

export const getAnimeMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

export const getAnimeTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_genres: '16',
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

// Trending anime movies (anime keyword + movies only)
export const getTrendingAnimeMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      'vote_count.gte': 50,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

// Popular anime movies
export const getPopularAnimeMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 20)
  } catch (error) {
    handleError(error)
  }
}

// Top rated anime movies
export const getTopRatedAnimeMovies = async () => {
  try {
    const url = buildUrl('/discover/movie', {
      with_keywords: '210024',
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 20)
  } catch (error) {
    handleError(error)
  }
}

// Trending anime series
export const getTrendingAnimeTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_genres: '16',
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      'vote_count.gte': 50,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

// Popular anime series
export const getPopularAnimeTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_genres: '16',
      with_keywords: '210024',
      sort_by: 'popularity.desc',
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 20)
  } catch (error) {
    handleError(error)
  }
}

// ─── GENRES & CATEGORIES ─────────────────────────────────

export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

export const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
]

export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const url = buildUrl('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data
  } catch (error) {
    handleError(error)
  }
}

// TMDB uses different genre IDs for movies vs TV. The browse menu links carry
// MOVIE genre IDs, so translate them to the closest TV genre before querying
// /discover/tv. IDs that are identical across movies & TV (e.g. Animation 16,
// Comedy 35, Crime 80, Drama 18, Family 10751, Mystery 9648, Western 37) are
// left untranslated and pass through unchanged.
export const MOVIE_TO_TV_GENRE = {
  28: 10759,     // Action          → Action & Adventure
  12: 10759,     // Adventure       → Action & Adventure
  14: 10765,     // Fantasy         → Sci-Fi & Fantasy
  878: 10765,    // Sci-Fi          → Sci-Fi & Fantasy
  10752: 10768,  // War             → War & Politics
  36: 10768,     // History         → War & Politics
  27: 9648,      // Horror          → Mystery (no TV horror genre)
  53: 9648,      // Thriller        → Mystery (no TV thriller genre)
  10749: 18,     // Romance         → Drama   (no TV romance genre)
  10402: 10764,  // Music           → Reality (no TV music genre)
}

export const getTVByGenre = async (genreId, page = 1) => {
  try {
    const tvGenreId = MOVIE_TO_TV_GENRE[genreId] ?? genreId
    const url = buildUrl('/discover/tv', {
      with_genres: tvGenreId,
      sort_by: 'popularity.desc',
      page
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data
  } catch (error) {
    handleError(error)
  }
}

export const getMoviesByGenreIds = async (genreIds) => {
  if (!genreIds || genreIds.length === 0) return []
  try {
    const url = buildUrl('/discover/movie', {
      with_genres: genreIds.join(','),
      sort_by: 'popularity.desc',
      'vote_count.gte': 50,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 25)
  } catch (error) {
    handleError(error)
  }
}

// ─── LANGUAGE / REGIONAL ─────────────────────────────────

export const getMoviesByLanguage = async (langCode, page = 1) => {
  try {
    const params = { sort_by: 'popularity.desc', page }
    if (langCode === 'bollywood') {
      params.with_original_language = 'hi'
      params.with_origin_country = 'IN'
    } else {
      params.with_original_language = langCode
    }
    const url = buildUrl('/discover/movie', params)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    handleError(error)
  }
}

export const getTVByLanguage = async (langCode, page = 1) => {
  try {
    const params = { sort_by: 'popularity.desc', page }
    if (langCode === 'bollywood') {
      params.with_original_language = 'hi'
      params.with_origin_country = 'IN'
    } else {
      params.with_original_language = langCode
    }
    const url = buildUrl('/discover/tv', params)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    handleError(error)
  }
}

export const searchSuggestions = async (query) => {
  if (!query || query.trim().length < 2) return []
  try {
    const url = buildUrl('/search/multi', { query: query.trim(), page: 1 })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, 6)
  } catch (error) {
    return []
  }
}

// Top rated anime series
export const getTopRatedAnimeTV = async () => {
  try {
    const url = buildUrl('/discover/tv', {
      with_genres: '16',
      with_keywords: '210024',
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100,
      page: 1
    })
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results.slice(0, 20)
  } catch (error) {
    handleError(error)
  }
}

