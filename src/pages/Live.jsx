import { useState, useEffect, useCallback } from 'react';
import {
  getAllMatches, getTodayMatches, getUpcomingMatches,
  formatMatchDate, clearMatchCache,
} from '../utils/football.js';
import MatchCard from '../components/live/MatchCard.jsx';
import LiveTVPanel from '../components/live/LiveTVPanel.jsx';
import styles from '../styles/Live.module.css';

const MAIN_TABS = [
  { id: 'schedule', label: '📅 Match Schedule' },
  { id: 'livetv',   label: '📺 Live TV' },
];
const SCHED_TABS = [
  { id: 'today',    label: 'Today' },
  { id: 'upcoming', label: 'This Week' },
  { id: 'all',      label: 'Full Schedule' },
];

function useMatches(fetchFn, refreshMs = 0) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const load = useCallback(async (force = false) => {
    if (force) clearMatchCache();
    setError(false);
    try {
      const result = await fetchFn();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load();
    if (refreshMs > 0) {
      const id = setInterval(() => load(), refreshMs);
      return () => clearInterval(id);
    }
  }, [load, refreshMs]);

  return { data, loading, error, retry: () => load(true) };
}

export default function Live() {
  const [mainTab,    setMainTab]    = useState('schedule');
  const [schedTab,   setSchedTab]   = useState('today');
  const [groupFilter, setGroupFilter] = useState('ALL');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = '⚽ FIFA World Cup 2026 | YourMovieLive';
  }, []);

  const { data: todayData,    loading: loadingToday,    error: errToday,    retry: retryToday    } = useMatches(getTodayMatches,    60_000);
  const { data: upcomingData, loading: loadingUpcoming, error: errUpcoming, retry: retryUpcoming } = useMatches(getUpcomingMatches, 300_000);
  const { data: allData,      loading: loadingAll,      error: errAll,      retry: retryAll      } = useMatches(getAllMatches,       600_000);

  const today    = todayData    || [];
  const upcoming = upcomingData || [];
  const all      = allData      || [];

  const live           = today.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const scheduledToday = today.filter(m => m.status !== 'IN_PLAY' && m.status !== 'PAUSED' && m.status !== 'FINISHED');
  const finishedToday  = today.filter(m => m.status === 'FINISHED');
  const finishedCount  = all.filter(m => m.status === 'FINISHED').length;

  // Extract groups A-L from "Group A", "Group B" etc. in stage field
  const groups = ['ALL', ...Array.from(
    new Set(all.map(m => {
      const g = m.stage?.match(/Group\s+([A-Z])/i);
      return g ? `Group ${g[1].toUpperCase()}` : null;
    }).filter(Boolean))
  ).sort()];

  // Apply group filter to full schedule
  const filteredAll = groupFilter === 'ALL'
    ? all
    : all.filter(m => m.stage?.toUpperCase().includes(groupFilter.toUpperCase()));

  // Group by date
  const byDate = filteredAll.reduce((acc, m) => {
    const k = m.utcDate.slice(0, 10);
    (acc[k] = acc[k] || []).push(m);
    return acc;
  }, {});

  const upcomingByDate = upcoming.reduce((acc, m) => {
    const k = formatMatchDate(m.utcDate);
    (acc[k] = acc[k] || []).push(m);
    return acc;
  }, {});

  const progress = all.length ? Math.round((finishedCount / all.length) * 100) : 0;

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.worldcupBadge}>🏆 FIFA WORLD CUP 2026</div>
            <h1 className={styles.heroTitle}>FIFA World <span className={styles.heroAccent}>Cup</span></h1>
            <p className={styles.heroSubtitle}>
              Live scores · Full schedule · Free live TV — all in one place
            </p>
            {live.length > 0 && (
              <div className={styles.liveAlert}>
                <div className={styles.livePulse} />
                {live.length} match{live.length > 1 ? 'es' : ''} LIVE right now
              </div>
            )}
            {/* Tournament progress bar */}
            {all.length > 0 && (
              <div className={styles.progressWrap}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                <span className={styles.progressLabel}>{finishedCount}/{all.length} matches played</span>
              </div>
            )}
          </div>

          <div className={styles.heroStats}>
            <Stat num={all.length || 104} label="Total Matches" />
            <Stat num={finishedCount}      label="Played" />
            <Stat num={48}                 label="Teams" />
          </div>
        </div>
      </div>

      {/* ── Main tabs ── */}
      <div className={styles.mainTabBar}>
        {MAIN_TABS.map(t => (
          <button key={t.id}
            className={`${styles.mainTab} ${mainTab === t.id ? styles.mainTabActive : ''}`}
            onClick={() => setMainTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.container}>

        {/* ══ SCHEDULE ══ */}
        {mainTab === 'schedule' && (
          <>
            {/* Live now */}
            {live.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitleRow}>
                  <div className={styles.liveIndicator} />
                  <h2 className={styles.sectionTitle}>LIVE NOW</h2>
                </div>
                <div className={styles.liveGrid}>
                  {live.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            )}

            {/* Sub-tabs */}
            <div className={styles.tabs}>
              {SCHED_TABS.map(t => (
                <button key={t.id}
                  className={`${styles.tab} ${schedTab === t.id ? styles.activeTab : ''}`}
                  onClick={() => setSchedTab(t.id)}>
                  {t.label}
                  <span className={styles.tabCount}>
                    {t.id === 'today' ? today.length : t.id === 'upcoming' ? upcoming.length : all.length}
                  </span>
                </button>
              ))}
            </div>

            {/* TODAY */}
            {schedTab === 'today' && (
              loadingToday ? <Spinner /> :
              errToday     ? <RetryState onRetry={retryToday} /> :
              today.length === 0
                ? <EmptyState icon="📅" title="No matches today" sub="Check 'This Week' or 'Full Schedule'" />
                : <>
                    {live.length          > 0 && <Group label="🔴 Live"          matches={live} />}
                    {scheduledToday.length > 0 && <Group label="🕐 Upcoming today" matches={scheduledToday} />}
                    {finishedToday.length  > 0 && <Group label="✅ Finished"       matches={finishedToday} />}
                  </>
            )}

            {/* THIS WEEK */}
            {schedTab === 'upcoming' && (
              loadingUpcoming ? <Spinner /> :
              errUpcoming     ? <RetryState onRetry={retryUpcoming} /> :
              upcoming.length === 0
                ? <EmptyState icon="🗓️" title="No matches in the next 7 days" sub="See Full Schedule for all fixtures" />
                : Object.entries(upcomingByDate).map(([label, ms]) =>
                    <Group key={label} label={`📅 ${label}`} matches={ms} />
                  )
            )}

            {/* FULL SCHEDULE */}
            {schedTab === 'all' && (
              loadingAll ? <Spinner text="Loading all 104 matches…" /> :
              errAll     ? <RetryState onRetry={retryAll} msg="Could not load schedule. ESPN API may be temporarily unavailable." /> :
              all.length === 0
                ? <EmptyState icon="🌍" title="No schedule data available" sub="ESPN match data hasn't loaded — tap retry or check back shortly" retry={retryAll} />
                : <>
                    {/* Group filter pills (only for group stage) */}
                    {groups.length > 2 && (
                      <div className={styles.groupFilter}>
                        {groups.map(g => (
                          <button key={g}
                            className={`${styles.groupPill} ${groupFilter === g ? styles.groupPillActive : ''}`}
                            onClick={() => setGroupFilter(g)}>
                            {g}
                          </button>
                        ))}
                      </div>
                    )}
                    {Object.entries(byDate).map(([date, ms]) => (
                      <Group key={date}
                        label={`📅 ${formatMatchDate(date + 'T12:00:00Z')} · ${date}`}
                        matches={ms} />
                    ))}
                  </>
            )}
          </>
        )}

        {/* ══ LIVE TV ══ */}
        {mainTab === 'livetv' && <LiveTVPanel />}

      </div>
    </div>
  );
}

/* ── Tiny reusable pieces ─────────────────────────────────── */

function Stat({ num, label }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function Group({ label, matches }) {
  return (
    <div className={styles.section}>
      <div className={styles.groupLabel}>{label}</div>
      <div className={styles.matchGrid}>
        {matches.map(m => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  );
}

function Spinner({ text = 'Loading matches…' }) {
  return (
    <div className={styles.loadingRow}>
      <div className={styles.spinner} /> {text}
    </div>
  );
}

function EmptyState({ icon, title, sub, retry }) {
  return (
    <div className={styles.emptyState}>
      <span>{icon}</span>
      <p>{title}</p>
      <p className={styles.emptySubtitle}>{sub}</p>
      {retry && <button className={styles.retryBtn} onClick={retry}>↻ Retry</button>}
    </div>
  );
}

function RetryState({ onRetry, msg = 'Failed to load match data.' }) {
  return (
    <div className={styles.emptyState}>
      <span>⚠️</span>
      <p style={{ color: '#f59e0b' }}>Connection error</p>
      <p className={styles.emptySubtitle}>{msg}</p>
      <button className={styles.retryBtn} onClick={onRetry}>↻ Retry</button>
    </div>
  );
}
