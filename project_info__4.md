# CineStream — Codebase Overview

## Summary
CineStream is a React + Vite movie/TV streaming website that uses TMDB (The Movie Database) API for content data and VidSrc / 2Embed / SuperEmbed / Vidking for video embeds. It features a dark-themed UI with sections for Movies, Shows, Kids, Anime, and a Watchlist. The site is designed to be deployed on shared hosting (static build output in `/dist`). No backend or database is required — all data comes from client-side API calls.

---

## 🚨 Mode Notice
**I'm in Explore Mode — a read-only codebase investigation mode.** I can analyze code and produce documentation, but I cannot create, modify, or implement any files. You requested a full FIFA World Cup 2026 Live page implementation with 13 new files and 3 modified files.

To implement this, **please switch to Act Mode** using the mode selector at the bottom of the chat. All findings below carry over as context — the implementation plan, file list, architecture details, and exact code specifications are fully documented.

---

## Architecture

### Pattern
React single-page application (SPA) using React Router v6 for client-side routing. No server-side rendering. The app follows a component-based architecture with:
- **Pages**: Route-level components that compose sections and manage page-specific state
- **Components**: Reusable UI building blocks (cards, sliders, layout, detail sections)
- **Hooks**: Custom React hooks for data fetching (`useTMDB`), scroll behavior (`useScrollHeader`), and watchlist state
- **Utils**: TMDB API functions and configuration constants
- **Context**: Watchlist state via React Context

### Technology Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build | Vite 5 |
| Routing | React Router v6 |
| Icons | lucide-react |
| Data Source | TMDB API (v3) |
| Video Embeds | VidSrc, 2Embed, SuperEmbed, Vidking |
| Styling | CSS Modules |
| Fonts | Bebas Neue, Playfair Display, Montserrat, DM Sans |

### Execution Flow
1. `index.html` → mounts `#root`
2. `src/main.jsx` → renders `<App />` with global CSS
3. `src/App.jsx` → sets up `BrowserRouter`, `WatchlistProvider`, `Header`, `Routes`, `Footer`
4. Each route renders a page component that fetches TMDB data via custom hooks and renders sections via reusable components

---

## Directory Structure (Current)

```
your-movie-live/
├── index.html
├── package.json              # react, react-dom, react-router-dom, lucide-react
├── vite.config.js
├── public/
│   ├── .htaccess
│   └── placeholder-*.jpg
├── src/
│   ├── main.jsx
│   ├── App.jsx               # Router + Providers + Layout + Routes
│   ├── config.js             # TMDB config + embed server definitions
│   ├── context/
│   │   └── WatchlistContext.jsx
│   ├── hooks/
│   │   ├── useScrollHeader.js
│   │   ├── useTMDB.js
│   │   └── useWatchlist.js
│   ├── utils/
│   │   └── tmdb.js           # All TMDB API functions
│   ├── pages/                # 10 pages (Home, Movies, Shows, Anime, Kids, etc.)
│   ├── components/
│   │   ├── layout/           # Header.jsx, Footer.jsx
│   │   ├── hero/             # HeroBanner.jsx
│   │   ├── slider/           # SliderCard, SliderRow, SliderSection
│   │   ├── detail/           # CastSection, MediaInfo, Player, TrailerBanner
│   │   ├── ui/               # Badge, ErrorMessage, Loader, MediaToggle
│   │   └── ...               # MovieCard, MovieGrid, EpisodeSelector
│   └── styles/               # 29 CSS Module files
```

---

## Key Findings for FIFA Page Implementation

### What Currently Exists
- **10 page routes**: `/`, `/movies`, `/shows`, `/kids`, `/anime`, `/movie/:id`, `/tv/:id`, `/watchlist`, `/search`, `*`
- **Header layout**: `[Logo] [Nav: Movies/Shows/Kids/Anime] <flex:1> [Search Bar + Watchlist]`
- **No `/live` route**, no football API integration, no NavTicker component
- **Style pattern**: All styles use CSS Modules (`Component.module.css`)
- **Theme colors**: `--accent: #e50914` (Netflix red) — matches the FIFA live red color
- **Fonts**: Bebas Neue (headings), DM Sans (UI text), Montserrat (body)

### What Needs to Be Created (13 files)
| File | Purpose |
|------|---------|
| `src/utils/football.js` | `getTodayMatches()`, `getUpcomingMatches()`, `getLiveMatches()`, score/status formatters |
| `src/utils/streamLinks.js` | Channel config (T Sports, BTV, Somoy TV, Toffee, Bioscope+, FIFA+, FIFA YouTube) + disclaimer text |
| `src/hooks/useFootball.js` | Custom hook with polling (60s refresh for live data) |
| `src/pages/Live.jsx` | Full page: hero, live banner, channel selector, today/upcoming tabs |
| `src/components/layout/NavTicker.jsx` | Scrolling ticker in header with match scores |
| `src/components/live/MatchCard.jsx` | Reusable match display card |
| `src/components/live/ChannelSelector.jsx` | Channel grid with disclaimer modal + 8s countdown |
| `src/styles/Live.module.css` | Page-wide styles |
| `src/styles/NavTicker.module.css` | Ticker animation styles |
| `src/styles/MatchCard.module.css` | Match card styles |
| `src/styles/ChannelSelector.module.css` | Channel grid + modal styles |

### What Needs to Be Modified (3 files)
1. **`src/App.jsx`** — Add `<Route path="/live" element={<Live />} />` import and route
2. **`src/components/layout/Header.jsx`** — Add `NavTicker` between nav links and search bar, add "⚽ FIFA Live" nav link

### Dependency to Install
```bash
npm install hls.js
```

---

## Implementation Plan (Ready for Act Mode)

The complete implementation details are available in the task prompt you provided. When you switch to **Act Mode**, the sequence should be:

1. `npm install hls.js`
2. Create `src/utils/football.js` and `src/utils/streamLinks.js`
3. Create `src/hooks/useFootball.js`
4. Create `src/components/layout/NavTicker.jsx` + `src/styles/NavTicker.module.css`
5. Create `src/components/live/MatchCard.jsx` + `src/styles/MatchCard.module.css`
6. Create `src/components/live/ChannelSelector.jsx` + `src/styles/ChannelSelector.module.css`
7. Create `src/pages/Live.jsx` + `src/styles/Live.module.css`
8. Modify `src/App.jsx` to add route
9. Modify `src/components/layout/Header.jsx` to add NavTicker and FIFA nav link

All exact file contents are specified in the task prompt you shared — they will serve as the implementation specification in Act Mode.

---

**Summary**: The codebase is a clean React + Vite SPA with CSS Modules and TMDB integration. Adding the FIFA World Cup 2026 Live page requires 13 new files and 3 modifications. All code is ready to implement — just switch to Act Mode to begin.