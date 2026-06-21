// Google favicon API — reliable fallback for any domain
// Returns the site's favicon as a 128x128 image
const favicon = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const CHANNELS = [
  // ── Bangladesh Official (FIFA WC 2026 rights holders) ──────────────
  {
    id: 'tsports-web',
    name: 'T Sports',
    subtitle: 'Live TV',
    logo: favicon('tsports.com'),
    logoFallback: '📺',
    logoColor: '#c8a020', // golden yellow like T Sports brand
    url: 'https://www.tsports.com/live-tv',
    youtubeUrl: 'https://www.youtube.com/@TSportsLiveBangladesh/streams',
    region: 'Bangladesh',
    flag: '🇧🇩',
    tag: 'OFFICIAL',
    tagColor: '#22c55e',
    featured: true,
    description: 'Official FIFA WC 2026 broadcaster in Bangladesh',
  },
  {
    id: 'btv',
    name: 'BTV',
    subtitle: 'Bangladesh Television',
    logo: favicon('btv.gov.bd'),
    logoFallback: '🏛',
    logoColor: '#1e6b3c',
    url: 'https://www.btv.gov.bd/live',
    region: 'Bangladesh',
    flag: '🇧🇩',
    tag: 'FREE',
    tagColor: '#22c55e',
    featured: false,
    description: 'State broadcaster — all 104 matches free-to-air',
  },
  {
    id: 'somoytv',
    name: 'Somoy TV',
    subtitle: 'Sports',
    logo: favicon('somoynews.tv'),
    logoFallback: '📡',
    logoColor: '#e50914',
    url: 'https://www.somoynews.tv/live',
    region: 'Bangladesh',
    flag: '🇧🇩',
    tag: 'OFFICIAL',
    tagColor: '#22c55e',
    featured: false,
    description: 'Official FIFA WC 2026 broadcaster',
  },
  {
    id: 'toffee',
    name: 'Toffee',
    subtitle: 'Banglalink',
    logo: favicon('toffee.com.bd'),
    logoFallback: '🍬',
    logoColor: '#f59e0b',
    url: 'https://www.toffee.com.bd',
    region: 'Bangladesh',
    flag: '🇧🇩',
    tag: 'FREE*',
    tagColor: '#f59e0b',
    featured: false,
    description: 'All 104 matches HD — free for Banglalink users',
  },
  {
    id: 'bioscope',
    name: 'Bioscope+',
    subtitle: 'Grameenphone',
    logo: favicon('bioscope.com.bd'),
    logoFallback: '🎬',
    logoColor: '#6d28d9',
    url: 'https://www.bioscope.com.bd',
    region: 'Bangladesh',
    flag: '🇧🇩',
    tag: 'FREE*',
    tagColor: '#f59e0b',
    featured: false,
    description: 'Full HD — free for GP users with bundle',
  },

  // ── Global Official Sources ──────────────────────────────────────────
  {
    id: 'fifaplus',
    name: 'FIFA+',
    subtitle: 'Official',
    logo: favicon('fifa.com'),
    logoFallback: '🏆',
    logoColor: '#1a56db',
    url: 'https://www.fifa.com/fifaplus/en/watch-live',
    region: 'Global',
    flag: '🌍',
    tag: 'FREE',
    tagColor: '#22c55e',
    featured: false,
    description: 'Official FIFA streaming — select matches free',
  },
  {
    id: 'fifa-youtube',
    name: 'FIFA YouTube',
    subtitle: 'Official Channel',
    logo: favicon('youtube.com'),
    logoFallback: '▶',
    logoColor: '#ff0000',
    url: 'https://www.youtube.com/@FIFA/streams',
    region: 'Global',
    flag: '🌍',
    tag: 'FREE',
    tagColor: '#22c55e',
    featured: false,
    description: 'Official FIFA YouTube live streams',
  },
];

// Legal disclaimer text
export const DISCLAIMER = {
  title: 'Disclaimer & Notice',
  body: `We do not host, upload, or stream any video content.
All links on this page redirect to their official licensed broadcasting platforms.
BTV, Somoy TV and T Sports jointly purchased FIFA World Cup 2026 broadcast rights
directly from FIFA for Bangladesh.`,
  sub: `For any concerns, please contact the respective official broadcaster directly.`,
  countdownSeconds: 8,
};
