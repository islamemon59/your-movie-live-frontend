import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <WatchlistProvider>
      <UserPreferencesProvider>
        <BrowserRouter>
          <ScrollToTop />
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
