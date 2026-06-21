# CineStream — Codebase Overview

## Summary
CineStream is a dark-themed movie and TV show streaming portal built with React + Vite. It uses the TMDB API for metadata (posters, ratings, cast, trailers) and third-party embed services (VidSrc, 2Embed, SuperEmbed, Vidking) for video playback via iframes. The site has a Netflix-like aesthetic with red accents (#e50914), horizontal slider rows, and a hero banner with auto-rotating highlights. Currently there is **NO Live TV page or route** — the user wants to add one.

## Architecture
- **Pattern**: Single-page application (SPA) with client-side routing
- **Tech stack**: React 18, React Router 6, Vite 5, plain CSS modules
- **State management**: React Context (watchlist) + localStorage persistence
- **Data fetching**: Custom `useTMDB` hook wrapping the TMDB REST API
- **Video playback**: iframe embeds from 4 third-party servers (configurable in `config.js`)
- **Styling**: CSS variables in `global.css`, component-scoped `.module.css` files, Bebas Neue / Playfair Display / DM Sans fonts

## Directory Structure
```
src/
├── App.jsx                    — Root component, routes definition
├── main.jsx                   — React entry point
├── config.js                  — TMDB API keys, embed server URLs, image helpers
├── context/
│   └── WatchlistContext.jsx   — Watchlist state via localStorage + Context API
├── hooks/
│   ├── useTMDB.js             — Generic TMDB fetch hook (abort controller, loading/error)
│   ├── useScrollHeader.js     — Scroll-based header visibility
│   └── useWatchlist.js        — (unused? — watchlist context handles this)
├── utils/
│   └── tmdb.js                — All TMDB API functions (movies, TV, search, hero, anime, kids)
├── pages/
│   ├── Home.jsx               — Homepage with hero + 11 slider sections
│   ├── Movies.jsx             — Movies page with hero + 6 slider sections
│   ├── Shows.jsx              — TV shows page (similar to Movies)
│   ├── Kids.jsx               — Kids content page
│   ├── Anime.jsx              — Anime content page
│   ├── Search.jsx             — Search results with tabs (all/movies/tv)
│   ├── Watchlist.jsx          — Saved items page
│   ├── MovieDetail.jsx        — Movie detail + player
│   ├── TVDetail.jsx           — TV show detail + season/episode selector + player
│   ├── NotFound.jsx           — 404 page
│   └── **(no Live.jsx yet)**    — Needs to be created
├── components/
│   ├── hero/HeroBanner.jsx    — Rotating slideshow hero banner
│   ├── slider/
│   │   ├── SliderSection.jsx  — Section title + SliderRow wrapper
│   │   ├── SliderRow.jsx      — Horizontal scrollable row with arrow buttons
│   │   └── SliderCard.jsx     — Card with poster, hover overlay, rank support
│   ├── layout/
│   │   ├── Header.jsx         — Sticky header with nav, search, watchlist badge
│   │   └── Footer.jsx         — Footer with TMDB credit
│   ├── detail/
│   │   ├── Player.jsx         — iframe embed player with server tabs
│   │   ├── TrailerBanner.jsx  — YouTube trailer auto-play or fallback backdrop
│   │   ├── MediaInfo.jsx      — Poster + metadata display
│   │   └── CastSection.jsx    — Horizontal scrollable cast cards
│   └── ui/
│       ├── Badge.jsx          — Inline badge (default/accent/gold)
│       ├── Loader.jsx         — Spinner
│       ├── ErrorMessage.jsx   — Red error box with optional retry
│       └── MediaToggle.jsx    — (exists but unused in current routes)
└── styles/
    ├── global.css             — CSS variables, reset, fonts, scrollbar
    ├── Header.module.css      — Sticky header, search bar, watchlist badge
    ├── Footer.module.css      — Footer layout
    ├── Home.module.css        — Home page layout
    ├── HeroBanner.module.css  — Full-width hero with backdrop
    ├── SliderSection.module.css
    ├── SliderRow.module.css   — Horizontal scroll container with arrow overlays
    ├── SliderCard.module.css  — Card with hover overlay + play button
    ├── MovieDetail.module.css / TVDetail.module.css / Player.module.css
    ├── CastSection.module.css
    ├── TrailerBanner.module.css
    ├── MediaInfo.module.css
    ├── MovieGrid.module.css
    ├── Search.module.css
    ├── Watchlist.module.css
    └── **(no Live TV CSS yet)**
```

## Key Abstractions

### useTMDB (custom hook)
- **File**: `src/hooks/useTMDB.js`
- **Responsibility**: Generic data fetching with loading/error states and abort controller
- **Signature**: `useTMDB(fetchFn, deps)` → `{ data, loading, error }`
- **Lifecycle**: Calls fetchFn on mount and when deps change. Aborts in-flight requests on cleanup.
- **Used by**: Every page component and HeroBanner

### WatchlistContext
- **File**: `src/context/WatchlistContext.jsx`
- **Responsibility**: Persist user's saved movies/TV shows in localStorage
- **API**: `{ watchlist, isLoading, addToWatchlist, removeFromWatchlist, isInWatchlist, clearWatchlist }`
- **Lifecycle**: Loads from localStorage on mount, saves on every change
- **Used by**: TVDetail, MovieDetail, Header (badge count)

### Player (detail/Player.jsx)
- **File**: `src/components/detail/Player.jsx`
- **Responsibility**: iframe embed player with server selector tabs
- **Props**: `tmdbId, mediaType ('movie'|'tv'), season, episode`
- **Lifecycle**: Builds embed URL from SERVERS config, shows loading spinner until iframe loads
- **Used by**: TVDetail, MovieDetail

### Config (config.js)
- **File**: `src/config.js`
- **Responsibility**: All configuration constants
- **Key exports**: `TMDB_API_KEY`, `TMDB_BASE`, `IMG.{poster,backdrop,still,avatar}`, `SERVERS.{movie,tv}`
- **SERVERS**: Array of {name, getUrl} — currently VidSrc, 2Embed, SuperEmbed, Vidking
- **Note**: This is where new live TV embed providers would be added

### tmdb.js (API utils)
- **File**: `src/utils/tmdb.js`
- **Responsibility**: All TMDB API wrapper functions
- **Key exports**: ~40 functions covering movies, TV, search, hero content, anime, kids
- **Pattern**: Each function calls `buildUrl(endpoint, params)`, fetches, handles errors, returns parsed data

## Routes (from App.jsx)
| Path | Component | Lazy? |
|------|-----------|-------|
| `/` | Home | No |
| `/movies` | Movies | No |
| `/shows` | Shows | No |
| `/kids` | Kids | No |
| `/anime` | Anime | No |
| `/movie/:id` | MovieDetail | Yes (lazy) |
| `/tv/:id` | TVDetail | Yes (lazy) |
| `/watchlist` | Watchlist | Yes (lazy) |
| `/search` | Search | No |
| `*` | NotFound | No |
| **(no /live route)** | — | — |

## Data Flow
1. User lands on Home → `HeroBanner` calls `getHighRated2026Movies()` via `useTMDB`
2. Each `SliderSection` calls its `fetchMovie` function → returns up to 25 items
3. User clicks a card → navigates to `/movie/:id` or `/tv/:id`
4. Detail page calls `getMovieDetails(id)` or `getTVDetails(id)` with `append_to_response: 'videos,credits,similar,watch/providers'`
5. User clicks "Play" or selects episode → `Player` component renders iframe from configured embed servers
6. Iframe loads third-party video player (VidSrc, 2Embed, etc.)

## Non-Obvious Behaviors & Design Decisions

- **No actual video hosting**: All video comes from third-party iframe embeds. The site itself hosts zero content.
- **TV show player is gated**: The Player component only renders after the user clicks an episode button (`showPlayer` state in TVDetail.jsx). The "Back to Episodes" button destroys the player.
- **HeroBanner auto-rotates every 3 seconds** and responds to click (left half = previous, right half = next). Touch swipe is also supported.
- **Header background is transparent** even when scrolled — this is unusual (most sites add backdrop-filter on scroll). The scroll logic exists in `useScrollHeader` but the CSS class `scrolled` only triggers a transparent background with no backdrop filter.
- **Search uses `/search?q=` query param** — not a separate route parameter. The search results page reads from `useSearchParams`.
- **Watchlist badge** in Header shows count, but watchlist badge position is absolute `top: -6px; right: -6px` which may clip on small screens.
- **CSS variable theme** is entirely dark (bg-primary: #0a0a0f). There is no light mode.
- **TMDB API key is hardcoded** in `config.js` — exposed to any client-side user. This is expected for TMDB (it's a public API), but rate limits apply.
- **getPrimeTV has a fallback** to page 2 if page 1 returns empty results — this indicates Amazon Prime TV data can be sparse via TMDB's watch provider filter.
- **Watchlist persistence** dispatches a custom `watchlistUpdated` event for cross-tab sync, but no listener is implemented to receive it.

## What You Need to Build (Live TV Section)

The user wants to add a Live TV section to the site. Currently there is:
- No `/live` route
- No `Live.jsx` page component
- No Live TV CSS module
- No Live TV data fetching functions
- The existing `Player` component only works for TMDB movie/TV IDs with iframe embeds — it can't play M3U8/HLS streams directly

### Files to create:
1. **`src/pages/Live.jsx`** — New page component with channel grid, disclaimer modal, channel selector
2. **`src/styles/Live.module.css`** — Styling for the Live TV section

### Files to modify:
1. **`src/App.jsx`** — Add route: `<Route path="/live" element={<Live />} />`
2. **`src/components/layout/Header.jsx`** — Add "Live TV" navigation link between "Anime" and the search area
3. **`src/components/layout/Footer.jsx`** — Add "Live TV" link

### Architecture decision:
The proposed implementation uses **redirects** (opens official broadcaster sites in new tabs) rather than playing streams directly. This is the simplest, most legal approach. No API calls, no `hls.js` needed — just a static `FREE_CHANNELS` array with channel metadata.

## Next Steps

I'm in **Explore Mode** — I've completed the full codebase investigation and documented everything you need. The report is saved as `project_info__1.md` in the project root.

To implement the Live TV feature (create `Live.jsx`, `Live.module.css`, update routes, header, and footer), switch to **Act Mode** using the mode selector at the bottom of the chat. All of my exploration findings — including the exact files to create/modify, the existing styling patterns, and the route structure — will carry over as context.