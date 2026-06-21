import { getScore, getStatusLabel, formatMatchDate } from '../../utils/football.js';
import styles from '../../styles/MatchCard.module.css';

function Crest({ src, name }) {
  if (!src) return <div className={styles.crestFallback}>{name?.[0] || '?'}</div>;
  return (
    <img
      src={src}
      alt={name}
      className={styles.crest}
      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
    />
  );
}

export default function MatchCard({ match }) {
  const home     = match.homeTeam;
  const away     = match.awayTeam;
  const score    = getScore(match);
  const status   = getStatusLabel(match);
  const isLive   = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isDone   = match.status === 'FINISHED';

  return (
    <div className={`${styles.card} ${isLive ? styles.liveCard : ''} ${isDone ? styles.finishedCard : ''}`}>
      {/* Top row: status badge + date */}
      <div className={styles.topRow}>
        <div className={`${styles.statusBadge} ${styles[status.type]}`}>
          {isLive && <span className={styles.livePing} />}
          {status.text}
        </div>
        <div className={styles.dateLabel}>{formatMatchDate(match.utcDate)}</div>
      </div>

      {/* Teams + score */}
      <div className={styles.matchRow}>
        <div className={styles.team}>
          <Crest src={home?.crest} name={home?.name} />
          <div className={styles.crestFallback} style={{ display: 'none' }}>{home?.name?.[0]}</div>
          <span className={`${styles.teamName} ${isLive ? styles.teamNameLive : ''}`}>
            {home?.shortName || home?.name || 'TBD'}
          </span>
        </div>

        <div className={`${styles.scoreBox} ${isLive ? styles.scoreBoxLive : ''}`}>
          <div className={styles.score}>{score}</div>
          {isLive && match.minute && <div className={styles.minute}>{match.minute}</div>}
        </div>

        <div className={`${styles.team} ${styles.teamRight}`}>
          <span className={`${styles.teamName} ${isLive ? styles.teamNameLive : ''}`}>
            {away?.shortName || away?.name || 'TBD'}
          </span>
          <Crest src={away?.crest} name={away?.name} />
          <div className={styles.crestFallback} style={{ display: 'none' }}>{away?.name?.[0]}</div>
        </div>
      </div>

      {/* Footer: stage + venue */}
      <div className={styles.footer}>
        {match.stage && <span className={styles.stage}>{match.stage.replace(/_/g, ' ')}</span>}
        {match.venue && <span className={styles.venue}>📍 {match.venue}</span>}
      </div>
    </div>
  );
}
