// ─────────────────────────────────────────────────────────────
//  ESPN public API — no key required, CORS-enabled
//  Slug fallbacks tried in order; fetches June & July separately
// ─────────────────────────────────────────────────────────────
const ESPN_BASE  = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const ESPN_SLUGS = ['fifa.world', 'men.world.cup', 'soccer.worldcup'];

// TheSportsDB (free key=3) as secondary fallback
const SDB_BASE    = 'https://www.thesportsdb.com/api/v1/json/3';
const SDB_WC_ID   = '4453';
const SDB_SEASONS = ['2025-2026', '2026', '2026-2027'];

// ── Helpers ─────────────────────────────────────────────────

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Normalise ESPN event → our internal shape
function fromESPN(ev) {
  const comp = ev.competitions?.[0] || {};
  const home = comp.competitors?.find(c => c.homeAway === 'home') || {};
  const away = comp.competitors?.find(c => c.homeAway === 'away') || {};
  const sname = ev.status?.type?.name || 'STATUS_SCHEDULED';

  let status = 'SCHEDULED';
  if (sname === 'STATUS_IN_PROGRESS')   status = 'IN_PLAY';
  else if (sname === 'STATUS_HALFTIME') status = 'PAUSED';
  else if (sname.includes('FINAL'))     status = 'FINISHED';
  else if (sname === 'STATUS_POSTPONED') status = 'POSTPONED';

  // Round / group label
  const notes    = comp.notes || [];
  const stageRaw = notes.find(n => n.type === 'rotation')?.text
                || ev.name?.split(' - ')[0]
                || 'Group Stage';

  const homeScore = home.score !== undefined && home.score !== '' ? parseInt(home.score) : null;
  const awayScore = away.score !== undefined && away.score !== '' ? parseInt(away.score) : null;

  return {
    id:       ev.id || String(Math.random()),
    utcDate:  ev.date || '',
    status,
    minute:   ev.status?.displayClock || null,
    stage:    stageRaw,
    group:    comp.series?.summary || '',
    venue:    comp.venue?.fullName || '',
    homeTeam: {
      name:      home.team?.displayName || 'TBD',
      shortName: home.team?.shortDisplayName || home.team?.abbreviation || 'TBD',
      abbr:      home.team?.abbreviation || home.team?.shortDisplayName?.slice(0, 3).toUpperCase() || 'TBD',
      crest:     home.team?.logo || '',
    },
    awayTeam: {
      name:      away.team?.displayName || 'TBD',
      shortName: away.team?.shortDisplayName || away.team?.abbreviation || 'TBD',
      abbr:      away.team?.abbreviation || away.team?.shortDisplayName?.slice(0, 3).toUpperCase() || 'TBD',
      crest:     away.team?.logo || '',
    },
    score: {
      fullTime: { home: homeScore, away: awayScore },
    },
  };
}

// Normalise TheSportsDB event → our internal shape
function fromSDB(e) {
  const dateStr = e.dateEvent || '';
  const timeStr = e.strTime   || '00:00:00';
  const utcDate = `${dateStr}T${timeStr}Z`;
  const s       = (e.strStatus || '').toLowerCase();

  let status = 'SCHEDULED';
  if (s === 'match finished' || s === 'ft') status = 'FINISHED';
  else if (s === 'live' || s === 'in play') status = 'IN_PLAY';
  else if (s === 'ht' || s === 'half time') status = 'PAUSED';
  else if (s === 'postponed')               status = 'POSTPONED';

  return {
    id:       e.idEvent || String(Math.random()),
    utcDate,
    status,
    minute:   e.intProgress || null,
    stage:    e.strRound || 'Group Stage',
    group:    e.strGroup || '',
    venue:    e.strVenue || '',
    homeTeam: {
      name:      e.strHomeTeam || 'TBD',
      shortName: e.strHomeTeam || 'TBD',
      crest:     e.strHomeTeamBadge || '',
    },
    awayTeam: {
      name:      e.strAwayTeam || 'TBD',
      shortName: e.strAwayTeam || 'TBD',
      crest:     e.strAwayTeamBadge || '',
    },
    score: {
      fullTime: {
        home: e.intHomeScore !== null && e.intHomeScore !== '' ? parseInt(e.intHomeScore) : null,
        away: e.intAwayScore !== null && e.intAwayScore !== '' ? parseInt(e.intAwayScore) : null,
      },
    },
  };
}

function sortMatches(arr) {
  return arr.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
}

// ── Cache ────────────────────────────────────────────────────

let _cache     = null;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export function clearMatchCache() { _cache = null; _cacheTime = 0; }

// ── Primary source: ESPN ─────────────────────────────────────

async function fetchFromESPN() {
  for (const slug of ESPN_SLUGS) {
    // Fetch June and July 2026 in parallel
    const [jun, jul] = await Promise.all([
      safeFetch(`${ESPN_BASE}/${slug}/scoreboard?dates=20260611-20260630&limit=200`),
      safeFetch(`${ESPN_BASE}/${slug}/scoreboard?dates=20260701-20260719&limit=200`),
    ]);

    const events = [...(jun?.events || []), ...(jul?.events || [])];
    // Deduplicate by id
    const seen = new Set();
    const unique = events.filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });

    if (unique.length >= 5) {   // real WC data has 48+ group games
      return unique.map(fromESPN);
    }

    // Try schedule endpoint as well
    const sched = await safeFetch(`${ESPN_BASE}/${slug}/schedule?season=2026&limit=200`);
    const schedEvents = sched?.events || sched?.content?.events || [];
    if (schedEvents.length >= 5) return schedEvents.map(fromESPN);
  }
  return null;
}

// ── Fallback: TheSportsDB ────────────────────────────────────

async function fetchFromSDB() {
  for (const s of SDB_SEASONS) {
    const data = await safeFetch(`${SDB_BASE}/eventsseason.php?id=${SDB_WC_ID}&s=${s}`);
    if (data?.events?.length >= 5) return data.events.map(fromSDB);
  }
  return null;
}

// ── Public API ───────────────────────────────────────────────

export async function getAllMatches() {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  const espn = await fetchFromESPN();
  if (espn?.length) {
    _cache = sortMatches(espn);
    _cacheTime = now;
    return _cache;
  }

  const sdb = await fetchFromSDB();
  if (sdb?.length) {
    _cache = sortMatches(sdb);
    _cacheTime = now;
    return _cache;
  }

  return [];
}

export async function getTodayMatches() {
  const all   = await getAllMatches();
  const today = new Date().toISOString().slice(0, 10);
  return all.filter(m => m.utcDate.slice(0, 10) === today);
}

export async function getUpcomingMatches() {
  const all = await getAllMatches();
  const now = Date.now();
  const end = now + 7 * 86_400_000;
  return all.filter(m => {
    const t = new Date(m.utcDate).getTime();
    return t > now && t <= end;
  });
}

export async function getLiveMatches() {
  const all = await getAllMatches();
  return all.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
}

// ── Formatting helpers ────────────────────────────────────────

export function formatKickoffTime(utcDate) {
  return new Date(utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatMatchDate(utcDate) {
  const d        = new Date(utcDate);
  const today    = new Date();
  const tomorrow = new Date(Date.now() + 86_400_000);
  if (d.toDateString() === today.toDateString())    return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getStatusLabel(match) {
  switch (match.status) {
    case 'IN_PLAY':   return { text: `LIVE ${match.minute ? match.minute : ''}`, type: 'live' };
    case 'PAUSED':    return { text: 'HALF TIME', type: 'paused' };
    case 'FINISHED':  return { text: 'FT',        type: 'finished' };
    case 'POSTPONED': return { text: 'POSTPONED', type: 'postponed' };
    default:          return { text: formatKickoffTime(match.utcDate), type: 'scheduled' };
  }
}

export function getScore(match) {
  const h = match.score?.fullTime?.home;
  const a = match.score?.fullTime?.away;
  if (match.status === 'SCHEDULED' || h === null || a === null) return 'vs';
  return `${h} - ${a}`;
}
