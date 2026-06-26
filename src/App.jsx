import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import { UserPreferencesProvider } from './context/UserPreferencesContext.jsx'
import { Header } from './components/layout/Header.jsx'
import { Footer } from './components/layout/Footer.jsx'
import { Loader } from './components/ui/Loader.jsx'
import { BackButton } from './components/ui/BackButton.jsx'
import { Search } from './pages/Search.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { Home } from './pages/Home.jsx'
import { Category } from './pages/Category.jsx'
import { History } from './pages/History.jsx'
import Movies from './pages/Movies.jsx'
import Shows from './pages/Shows.jsx'
import Kids from './pages/Kids.jsx'
import Anime from './pages/Anime.jsx'
import Live from './pages/Live.jsx'

// Lazy load detail pages
const MovieDetail = lazy(() => import('./pages/MovieDetail.jsx'))
const TVDetail = lazy(() => import('./pages/TVDetail.jsx'))
const Watchlist = lazy(() => import('./pages/Watchlist.jsx'))
const LanguagePage = lazy(() => import('./pages/LanguagePage.jsx'))

// Per-tab store of scroll positions, keyed by path. sessionStorage survives a
// reload (but not a closed tab), which is exactly what we want here.
const SCROLL_KEY = 'scrollPositions'
const getScrollPositions = () => {
  try { return JSON.parse(sessionStorage.getItem(SCROLL_KEY)) || {} } catch { return {} }
}
const setScrollPosition = (key, y) => {
  try {
    const positions = getScrollPositions()
    positions[key] = y
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions))
  } catch { /* sessionStorage unavailable — ignore */ }
}

// Restores the scroll position on reload and back/forward (navigationType POP),
// and scrolls to the top when navigating to a new page (PUSH/REPLACE).
function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType()
  const key = location.pathname + location.search

  // Take over scroll restoration from the browser — its native restore fires
  // before our async TMDB content has loaded, so it lands in the wrong place.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Continuously remember where the user is on the current page.
  useEffect(() => {
    let timer = null
    const remember = () => setScrollPosition(key, window.scrollY)
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(remember, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('beforeunload', remember)
    return () => {
      remember() // save before leaving this path (SPA navigation)
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', remember)
    }
  }, [key])

  // Restore (POP) or reset to top (PUSH/REPLACE) when the path changes.
  useEffect(() => {
    const saved = navType === 'POP' ? getScrollPositions()[key] : 0

    if (!saved) {
      window.scrollTo(0, 0)
      return
    }

    // Content loads asynchronously, so the page may be too short to reach the
    // saved offset yet — retry until it's tall enough (best effort, ~3s cap).
    let attempts = 0
    let raf = 0
    let timer = null
    const restore = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll >= saved || attempts >= 30) {
        window.scrollTo(0, saved)
      } else {
        attempts += 1
        timer = setTimeout(() => { raf = requestAnimationFrame(restore) }, 100)
      }
    }
    restore()
    return () => { cancelAnimationFrame(raf); clearTimeout(timer) }
  }, [key, navType])

  return null
}

function App() {
  return (
    <WatchlistProvider>
      <UserPreferencesProvider>
        <BrowserRouter>
          <ScrollManager />
          <Header />
          {/* padding-top pushes content below the fixed header */}
          <main style={{
            minHeight: 'calc(100vh - 64px)',
            background: 'var(--bg-primary)',
            paddingTop: 'var(--header-height)',
          }}>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/shows" element={<Shows />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/anime" element={<Anime />} />
                <Route path="/fifa-live" element={<Live />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<TVDetail />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/category/:genreId/:genreName" element={<Category />} />
                <Route path="/language/:langCode/:langName" element={<LanguagePage />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <BackButton />
          <Footer />
        </BrowserRouter>
      </UserPreferencesProvider>
    </WatchlistProvider>
  )
}

export default App
