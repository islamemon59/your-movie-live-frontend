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

// Multi-server embed APIs for movies and TV shows
// Vidking is first — it becomes the default player
export const SERVERS = {
  movie: [
    {
      name: 'Vidking',
      getUrl: (id) => `https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true`,
    },
    {
      name: 'VidSrc',
      getUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    },
    {
      name: '2Embed',
      getUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    },
    {
      name: 'SuperEmbed',
      getUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    },
  ],
  tv: [
    {
      name: 'Vidking',
      getUrl: (id, s, e) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`,
    },
    {
      name: 'VidSrc',
      getUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
    },
    {
      name: '2Embed',
      getUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
    },
    {
      name: 'SuperEmbed',
      getUrl: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    },
  ],
};
