export const TMDB_API_KEY = 'cc246070cb59ee07af436d5502dd74b2';
export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMG = 'https://image.tmdb.org/t/p';
export const VIDKING_BASE = 'https://www.vidking.net/embed';
export const VIDKING_COLOR = 'e50914';

export const IMG = {
  poster: (path) => path ? `${TMDB_IMG}/w342${path}` : '/placeholder-poster.jpg',
  posterLg: (path) => path ? `${TMDB_IMG}/w500${path}` : '/placeholder-poster.jpg',
  backdrop: (path) => path ? `${TMDB_IMG}/w1280${path}` : '/placeholder-backdrop.jpg',
  still: (path) => path ? `${TMDB_IMG}/w300${path}` : '/placeholder-still.jpg',
  avatar: (path) => path ? `${TMDB_IMG}/w185${path}` : '/placeholder-avatar.jpg',
};

// Download servers — open real search-result pages in a new tab
export const DOWNLOAD_SERVERS = {
  movie: [
    {
      name: 'SolidTorrents',
      desc: 'Aggregates YTS, 1337x & more — sorted by seeds',
      quality: '4K · 1080p · 720p',
      getUrl: (_id, title) =>
        `https://solidtorrents.to/search?q=${encodeURIComponent(title)}&sort=seeders`,
    },
    {
      name: '1337x',
      desc: 'Large library, all qualities',
      quality: 'Multi-quality',
      getUrl: (_id, title) =>
        `https://1337x.to/search/${encodeURIComponent(title + ' 1080p')}/1/`,
    },
    {
      name: 'Torrentz2',
      desc: 'Meta-search across dozens of torrent sites',
      quality: 'All qualities',
      getUrl: (_id, title) =>
        `https://torrentz2.nz/search?q=${encodeURIComponent(title)}`,
    },
    {
      name: 'LimeTorrents',
      desc: 'Fast HD downloads',
      quality: '1080p · 720p',
      getUrl: (_id, title) =>
        `https://www.limetorrents.lol/search/all/${encodeURIComponent(title)}/seeds/1/`,
    },
  ],
  tv: [
    {
      name: 'EZTV',
      desc: 'Best dedicated TV episode tracker',
      quality: '1080p · 720p · 480p',
      getUrl: (_id, title) =>
        `https://eztv.re/search/${encodeURIComponent(title)}`,
    },
    {
      name: '1337x',
      desc: 'Searches exact episode S##E##',
      quality: 'Multi-quality',
      getUrl: (_id, title, s, e) =>
        `https://1337x.to/search/${encodeURIComponent(`${title} S${String(s).padStart(2,'0')}E${String(e).padStart(2,'0')}`)}/1/`,
    },
    {
      name: 'Torrentz2',
      desc: 'Meta-search across dozens of torrent sites',
      quality: 'All qualities',
      getUrl: (_id, title, s, e) =>
        `https://torrentz2.nz/search?q=${encodeURIComponent(`${title} S${String(s).padStart(2,'0')}E${String(e).padStart(2,'0')}`)}`,
    },
    {
      name: 'LimeTorrents',
      desc: 'Fast TV downloads',
      quality: '1080p · 720p',
      getUrl: (_id, title) =>
        `https://www.limetorrents.lol/search/tv/${encodeURIComponent(title)}/seeds/1/`,
    },
  ],
}

// Multi-server embed APIs for movies and TV shows.
// All are free TMDB-based embed providers, like way2movies / cineby. The viewer
// can switch servers if one is down, so the more LIVE servers we list, the more
// likely at least one is streaming any given title.
//
// Every domain/format below was re-probed live (HTTP 200, real player HTML) on
// 2026-06-26 for both a movie (tmdb 27205) and a TV episode (tmdb 1399 S1E1).
// Vidking is the default (index 0); the rest are fallbacks the viewer can pick.
// (VidSrc.cc was removed on 2026-06-26 — its Cloudflare origin returned HTTP 522.)
//
// MAINTENANCE: these providers rotate domains every few months. If a server
// dies for everyone, DON'T just delete it — re-probe and swap its base domain
// (e.g. the vidsrc family mirrors across vidsrc.xyz / .net / .pm / .in / .me).
// Re-run the probe with: curl -sL -m10 -o /dev/null -w '%{http_code}' <url>
export const SERVERS = {
  movie: [
    {
      // Default server: this is the one that auto-loads (index 0) when a user
      // hits play. Viewers can switch to any other server from the bar above.
      name: 'Vidking',
      getUrl: (id) => `https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true`,
    },
    {
      name: 'VidRock',
      getUrl: (id) => `https://vidrock.net/movie/${id}`,
    },
    {
      name: 'Videasy',
      getUrl: (id) => `https://player.videasy.net/movie/${id}?color=e50914`,
    },
    {
      // Aggregates many working hosts (vipstream / voe / streamwish / doodstream
      // / mixdrop / filelions etc.) — very reliable, but shows ads / pop-ups.
      name: 'SuperEmbed',
      getUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    },
    {
      name: 'VidFast',
      getUrl: (id) => `https://vidfast.pro/movie/${id}?theme=e50914&autoPlay=true`,
    },
    {
      name: 'VidLink',
      getUrl: (id) => `https://vidlink.pro/movie/${id}?primaryColor=e50914&autoplay=true`,
    },
    {
      name: 'VidSrc.su',
      getUrl: (id) => `https://vidsrc.su/embed/movie/${id}`,
    },
    {
      name: 'VidNest',
      getUrl: (id) => `https://vidnest.fun/movie/${id}`,
    },
    {
      name: 'Spencer',
      getUrl: (id) => `https://spencerdevs.xyz/movie/${id}`,
    },
    {
      // vidsrc family mirror (vidsrc.pm / .net / .me share one backend).
      // Do NOT use vidsrc.in here — it sends X-Frame-Options: sameorigin and
      // cannot be embedded in an iframe at all.
      name: 'VidSrc',
      getUrl: (id) => `https://vidsrc.pm/embed/movie?tmdb=${id}`,
    },
    {
      // Aggregator — internally serves streamwish / doodstream / filemoon etc.
      name: '111Movies',
      getUrl: (id) => `https://111movies.com/movie/${id}`,
    },
    {
      name: 'AutoEmbed',
      getUrl: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    },
    {
      name: 'MoviesAPI',
      getUrl: (id) => `https://moviesapi.to/movie/${id}`,
    },
    {
      name: '2Embed',
      getUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    },
    // Added 2026-06-26 — all probed live (HTTP 200, real player HTML).
    {
      name: 'EmbedSU',
      getUrl: (id) => `https://embed.su/embed/movie/${id}`,
    },
    {
      name: 'VidSrc.to',
      getUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    },
    {
      name: 'Pstream',
      getUrl: (id) => `https://iframe.pstream.org/embed/tmdb-movie-${id}`,
    },
    {
      name: 'Nontongo',
      getUrl: (id) => `https://www.nontongo.win/embed/movie/${id}`,
    },
    {
      name: 'SmashyStream',
      getUrl: (id) => `https://embed.smashystream.com/playere.php?tmdb=${id}`,
    },
    {
      name: '2Embed.skin',
      getUrl: (id) => `https://www.2embed.skin/embed/${id}`,
    },
  ],
  tv: [
    {
      // Default server: this is the one that auto-loads (index 0) when a user
      // hits play. Viewers can switch to any other server from the bar above.
      name: 'Vidking',
      getUrl: (id, s, e) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`,
    },
    {
      name: 'VidRock',
      getUrl: (id, s, e) => `https://vidrock.net/tv/${id}/${s}/${e}`,
    },
    {
      name: 'Videasy',
      getUrl: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}?color=e50914&nextEpisode=true&episodeSelector=true`,
    },
    {
      // Aggregates many working hosts (vipstream / voe / streamwish / doodstream
      // / mixdrop / filelions etc.) — very reliable, but shows ads / pop-ups.
      name: 'SuperEmbed',
      getUrl: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    },
    {
      name: 'VidFast',
      getUrl: (id, s, e) => `https://vidfast.pro/tv/${id}/${s}/${e}?theme=e50914&autoPlay=true&nextButton=true`,
    },
    {
      name: 'VidLink',
      getUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=e50914&autoplay=true&nextbutton=true`,
    },
    {
      name: 'VidSrc.su',
      getUrl: (id, s, e) => `https://vidsrc.su/embed/tv/${id}/${s}/${e}`,
    },
    {
      name: 'VidNest',
      getUrl: (id, s, e) => `https://vidnest.fun/tv/${id}/${s}/${e}`,
    },
    {
      name: 'Spencer',
      getUrl: (id, s, e) => `https://spencerdevs.xyz/tv/${id}/${s}/${e}`,
    },
    {
      // vidsrc family mirror (vidsrc.pm / .net / .me share one backend).
      // Do NOT use vidsrc.in here — it sends X-Frame-Options: sameorigin and
      // cannot be embedded in an iframe at all.
      name: 'VidSrc',
      getUrl: (id, s, e) => `https://vidsrc.pm/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
    },
    {
      // Aggregator — internally serves streamwish / doodstream / filemoon etc.
      name: '111Movies',
      getUrl: (id, s, e) => `https://111movies.com/tv/${id}/${s}/${e}`,
    },
    {
      name: 'AutoEmbed',
      getUrl: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
    },
    {
      name: 'MoviesAPI',
      getUrl: (id, s, e) => `https://moviesapi.to/tv/${id}-${s}-${e}`,
    },
    {
      name: '2Embed',
      getUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
    },
    // Added 2026-06-26 — all probed live (HTTP 200, real player HTML).
    {
      name: 'EmbedSU',
      getUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
    },
    {
      name: 'VidSrc.to',
      getUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
    },
    {
      name: 'Pstream',
      getUrl: (id, s, e) => `https://iframe.pstream.org/embed/tmdb-tv-${id}/${s}/${e}`,
    },
    {
      name: 'Nontongo',
      getUrl: (id, s, e) => `https://www.nontongo.win/embed/tv/${id}/${s}/${e}`,
    },
    {
      name: 'SmashyStream',
      getUrl: (id, s, e) => `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`,
    },
    {
      name: '2Embed.skin',
      getUrl: (id, s, e) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
    },
  ],
};
