# CineStream — Codebase Overview

## Summary
CineStream is a React + Vite movie/TV streaming website that uses TMDB (The Movie Database) API for content data and VidSrc / 2Embed / SuperEmbed / Vidking for video embeds. It features a dark-themed UI with sections for Movies, Shows, Kids, Anime, and a Watchlist. The site is designed to be deployed on shared hosting (static build output in `/dist`). No backend or database is required — all data comes from client-side API calls.

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

## Directory Structure

```
your-movie-live/
├── index.html                # Vite entry point
├── package.json              # Dependencies: react, react-dom, react-router-dom, lucide-react
├── vite.config.js            # Vite config (React plugin)
├── public/
│   ├── .htaccess             # SPA fallback for shared hosting (Apache)
│   └── placeholder-*.jpg     # Placeholder images for missing data
├── src/
│   ├── main.jsx              # React entry — renders <App />
│   ├── App.jsx               # Root: Router + Providers + Layout + Routes
│   ├── config.js             # TMDB API config + embed server definitions
│   ├── context/
│   │   └── WatchlistContext.jsx  # Watchlist state via React Context + localStorage
│   ├── hooks/
│   │   ├── useScrollHeader.js    # Tracks scroll position for header styling
│   │   ├── useTMDB.js           # Generic TMDB fetch hook (abort controller, loading/error states)
│   │   └── useWatchlist.js      # Watchlist helper hook
│   ├── utils/
│   │   └── tmdb.js              # All TMDB API functions (movies, TV, search, hero, kids, anime)
│   ├── pages/
│   │   ├── Home.jsx             # Landing page with hero banner + sections
│   │   ├── Movies.jsx           # Movie listing page
│   │   ├── Shows.jsx            # TV show listing page
│   │   ├── Kids.jsx             # Kids content page
│   │   ├── Anime.jsx            # Anime content page
│   │   ├── MovieDetail.jsx      # Movie detail page (trailer, embed, cast, similar)
│   │   ├── TVDetail.jsx         # TV detail page (seasons, episodes, embed)
│   │   ├── Search.jsx           # Search results
│   │   ├── Watchlist.jsx        # User's saved content
│   │   └── NotFound.jsx         # 404
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Sticky header with nav, search, watchlist button
│   │   │   └── Footer.jsx       # Site footer
│   │   ├── hero/
│   │   │   └── HeroBanner.jsx   # Full-width hero with backdrop, trailer, gradient
│   │   ├── slider/
│   │   │   ├── SliderCard.jsx   # Individual card in a row
│   │   │   ├── SliderRow.jsx    # Horizontal scrolling row of cards
│   │   │   └── SliderSection.jsx # Section wrapper with title + SliderRow
│   │   ├── detail/
│   │   │   ├── CastSection.jsx  # Cast grid
│   │   │   ├── MediaInfo.jsx    # Movie/TV metadata display
│   │   │   ├── Player.jsx       # Video embed iframe
│   │   │   └── TrailerBanner.jsx # YouTube trailer embed
│   │   ├── ui/
│   │   │   ├── Badge.jsx        # Small label badge
│   │   │   ├── ErrorMessage.jsx # Error display component
│   │   │   ├── Loader.jsx       # Spinner component
│   │   │   └── MediaToggle.jsx  # Toggle between media types
│   │   ├── MovieCard.jsx        # Card for movie/TV items
│   │   ├── MovieGrid.jsx        # Grid of MovieCards
│   │   ├── Player.jsx           # Video player (used in detail pages)
│   │   ├── EpisodeSelector.jsx  # Season/episode picker for TV
│   │   └── Loader.jsx           # Full-page loader
│   └── styles/                  # CSS Modules (one per component)
│       ├── global.css           # CSS variables, resets, scrollbar, typography
│       ├── Header.module.css
│       ├── Footer.module.css
│       ├── HeroBanner.module.css
│       ├── MovieCard.module.css
│       ├── MovieGrid.module.css
│       └── ... (29 CSS module files total)
```

## Key Abstractions

### App.jsx (Root)
- **File**: `src/App.jsx`
- **Responsibility**: Sets up routing, providers, and persistent layout
- **Key detail**: Wraps everything in `WatchlistProvider` and `BrowserRouter`. Detail pages (`MovieDetail`, `TVDetail`, `Watchlist`) are lazy-loaded with `Suspense`.
- **Current routes**: `/`, `/movies`, `/shows`, `/kids`, `/anime`, `/movie/:id`, `/tv/:id`, `/watchlist`, `/search`, `*`

### useTMDB (Data Fetching Hook)
- **File**: `src/hooks/useTMDB.js`
- **Responsibility**: Generic fetch hook with loading/error states and abort controller
- **Lifecycle**: Calls fetch function on mount and when deps change. Aborts previous request on cleanup.
- **Note**: No polling/refresh mechanism — data loads once per mount/deps change

### TMDB Utils (`src/utils/tmdb.js`)
- **File**: `src/utils/tmdb.js` (~580 lines)
- **Responsibility**: Contains ALL TMDB API functions — movies, TV, heroes, search, kids, anime
- **Pattern**: Each function builds a URL via `buildUrl()`, fetches with error handling, returns sliced results
- **Key endpoints**: trending, top_rated, popular, discover (with genre/provider filters), search/multi, movie/{id} (with `append_to_response`), tv/{id}, tv/{id}/season/{n}

### Config (`src/config.js`)
- **File**: `src/config.js`
- **Responsibility**: API keys, base URLs, image URL builders, embed server definitions
- **Contains**: `TMDB_API_KEY`, `IMG` object with poster/backdrop/still URL builders, `SERVERS` object with movie/tv embed providers (VidSrc, 2Embed, SuperEmbed, Vidking)

### Header
- **File**: `src/components/layout/Header.jsx`
- **Responsibility**: Sticky header with logo, navigation, search form, and watchlist button
- **Behavior**: Uses `useScrollHeader(20)` to detect scroll position. Shows watchlist badge count from context.
- **Current nav**: Movies, Shows, Kids, Anime

### WatchlistContext
- **File**: `src/context/WatchlistContext.jsx`
- **Responsibility**: Manages watchlist state, persists to localStorage
- **Pattern**: React Context + useReducer pattern

### CSS Variables (global.css)
- **Key variables**: `--bg-primary: #0a0a0f`, `--accent: #e50914`, `--header-height: 68px`, `--border: #1f1f2e`, etc.
- **Fonts**: Bebas Neue (headings), Playfair Display, Montserrat (body), DM Sans (UI text)

## Data Flow

1. **Navigation**: User clicks nav link → `navigate('/movies')` → Router renders `<Movies />` page
2. **Page Mount**: Page component calls `useTMDB(fetchFn, deps)` → hook calls TMDB API → returns `{ data, loading, error }`
3. **Sections**: Page renders slider sections / grid components, passing data as props
4. **Detail Flow**: User clicks card → `navigate('/movie/:id')` → `MovieDetail` fetches full movie details with `append_to_response=videos,credits,similar,watch/providers`
5. **Video Play**: Detail page shows trailer (YouTube iframe) + embed player (iframe to VidSrc/2Embed/SuperEmbed/Vidking)
6. **Search**: Header search form → `navigate('/search?q=...')` → Search page calls `searchMulti()` → shows MovieGrid results

## Non-Obvious Behaviors & Design Decisions

### What's Missing
- **No `/live` route exists** — the FIFA World Cup Live page needs to be created from scratch
- **No `hls.js` dependency** — needs to be installed via npm
- **No `NavTicker` component** — the header doesn't have a ticker bar yet
- **No football/sports API integration** — all current data comes from TMDB only

### Key Observations for FIFA Page Implementation
1. **Header layout**: The current Header uses flexbox with `[Logo] [Nav] <flex:1> [Actions]`. The NavTicker needs to be inserted between nav links and the search bar area — this will require modifying `Header.jsx` to add a middle section
2. **CSS Module pattern**: All styles use CSS Modules with the naming convention `[Component].module.css`. New FIFA components must follow this pattern
3. **API Pattern**: The existing `useTMDB` hook uses abort controllers and no polling. The `useFootball.js` hook will need different behavior (periodic refetching every 30-60 seconds for live scores)
4. **No existing `components/live/` directory** — needs to be created
5. **No existing `components/layout/NavTicker.jsx`** — needs to be added
6. **Font families used**: Bebas Neue (headline display), DM Sans (UI/badges), Montserrat (body). FIFA components use these same fonts
7. **Color variable alignment**: The theme uses `--accent: #e50914` (Netflix red) — FIFA's live indicator styling uses the same `#e50914` color, which matches the existing brand

### Build & Deployment
- Build command: `npm run build` → outputs to `/dist`
- Shared hosting: `public/.htaccess` handles SPA fallback (rewrites all routes to `index.html`)
- No environment variables — API keys are hardcoded in `src/config.js` and `src/utils/football.js`

## Module Reference (Key Files)

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component with routing and providers |
| `src/main.jsx` | React DOM entry point |
| `src/config.js` | TMDB config, image URLs, embed server definitions |
| `src/utils/tmdb.js` | All TMDB API functions |
| `src/hooks/useTMDB.js` | Generic data fetch hook |
| `src/context/WatchlistContext.jsx` | Watchlist state management |
| `src/components/layout/Header.jsx` | Site header with navigation |
| `src/styles/global.css` | CSS variables, resets, theme |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/MovieDetail.jsx` | Movie detail with trailer + player |
| `src/pages/TVDetail.jsx` | TV show detail with seasons/episodes |
| `src/components/detail/Player.jsx` | Video embed iframe component |
| `src/components/slider/SliderSection.jsx` | Reusable content section with horizontal scroll |

## Suggested Reading Order (for a developer joining)

1. **`src/App.jsx`** — Understand the routing structure and what pages exist
2. **`src/styles/global.css`** — Learn the design system (variables, fonts, theme colors)
3. **`src/config.js`** — Understand API keys, image URLs, and embed providers
4. **`src/hooks/useTMDB.js`** — The data fetching pattern used by every page
5. **`src/utils/tmdb.js`** — All API functions (large file, skim for patterns)
6. **`src/components/layout/Header.jsx`** — The component that will need modification for the FIFA ticker
7. **`src/pages/Home.jsx`** — Example page implementation with sections and sliders

## Implementation Plan for FIFA Live Page (/live)

The following files need to be **created** and **modified** to implement the FIFA World Cup 2026 Live page:

### Files to CREATE (13):
1. `src/utils/football.js` — Football API functions
2. `src/utils/streamLinks.js` — Official stream channel config
3. `src/hooks/useFootball.js` — Custom polling hook
4. `src/pages/Live.jsx` — Full Live page
5. `src/components/layout/NavTicker.jsx` — Scrolling match ticker
6. `src/components/live/MatchCard.jsx` — Match card component
7. `src/components/live/ChannelSelector.jsx` — TV channel grid with disclaimer
8. `src/styles/Live.module.css` — Live page styles
9. `src/styles/NavTicker.module.css` — Ticker styles
10. `src/styles/MatchCard.module.css` — Match card styles
11. `src/styles/ChannelSelector.module.css` — Channel selector styles

### Files to MODIFY (3):
1. `src/App.jsx` — Add `/live` route
2. `src/components/layout/Header.jsx` — Add NavTicker + FIFA Live nav link

### Dependency to INSTALL:
1. `npm install hls.js`

Note: The user has requested implementation, but this agent is in **Explore Mode** (read-only). To create/modify files, switch to **Act Mode**.
