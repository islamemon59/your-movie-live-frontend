import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { getTodayMatches, getAllMatches, getScore } from '../../utils/football.js';
import styles from '../../styles/NavTicker.module.css';

// ESPN/FIFA 3-letter abbreviation → ISO 3166-1 alpha-2 for flagcdn.com
const FLAG = {
  AFG:'af', ALB:'al', ALG:'dz', AND:'ad', ANG:'ao', ARG:'ar', ARM:'am', AUS:'au',
  AUT:'at', AZE:'az', BAN:'bd', BLR:'by', BEL:'be', BEN:'bj', BOL:'bo', BIH:'ba',
  BRA:'br', BUL:'bg', BFA:'bf', CMR:'cm', CAN:'ca', CPV:'cv', CAP:'cv', CHI:'cl',
  CHN:'cn', COL:'co', COD:'cd', CGO:'cg', CRC:'cr', CIV:'ci', CRO:'hr', CUB:'cu',
  CYP:'cy', CZE:'cz', DEN:'dk', DOM:'do', ECU:'ec', EGY:'eg', ESA:'sv', ENG:'gb-eng',
  EST:'ee', FIN:'fi', FRA:'fr', GAB:'ga', GAM:'gm', GEO:'ge', GER:'de', GHA:'gh',
  GRE:'gr', GTM:'gt', GUI:'gn', GUY:'gy', HAI:'ht', HON:'hn', HUN:'hu', ISL:'is',
  IND:'in', IDN:'id', IRN:'ir', IRQ:'iq', IRL:'ie', ISR:'il', ITA:'it', JAM:'jm',
  JPN:'jp', JOR:'jo', KAZ:'kz', KEN:'ke', KOR:'kr', KWT:'kw', LAO:'la', LVA:'lv',
  LBN:'lb', LBR:'lr', LBA:'ly', LIE:'li', LTU:'lt', LUX:'lu', MWI:'mw', MAS:'my',
  MLI:'ml', MLT:'mt', MAR:'ma', MOZ:'mz', MEX:'mx', MDA:'md', MNE:'me', NAM:'na',
  NED:'nl', NZL:'nz', NCA:'ni', NIG:'ne', NGA:'ng', NOR:'no', OMA:'om', PAK:'pk',
  PAN:'pa', PAR:'py', PER:'pe', POL:'pl', POR:'pt', QAT:'qa', MKD:'mk', ROM:'ro',
  RUS:'ru', RWA:'rw', SAU:'sa', KSA:'sa', SCO:'gb-sct', SEN:'sn', SRB:'rs',
  SVK:'sk', SVN:'si', RSA:'za', ESP:'es', SWE:'se', SUI:'ch', SYR:'sy', TJK:'tj',
  TAN:'tz', THA:'th', TOG:'tg', TRI:'tt', TUN:'tn', TUR:'tr', UGA:'ug', UKR:'ua',
  UAE:'ae', USA:'us', URU:'uy', UZB:'uz', VEN:'ve', WAL:'gb-wls', ZAM:'zm', ZIM:'zw',
  // ESPN alternate codes
  HOL:'nl', GBR:'gb', EIR:'ie', NLD:'nl', DEU:'de', CUW:'cw', MTQ:'mq',
  SKN:'kn', TCA:'tc', LCA:'lc', VGB:'vg', GUF:'gf', SUR:'sr', TLS:'tl',
  // ISO 2-letter fallbacks (ESPN occasionally sends these)
  JP:'jp', ES:'es', DE:'de', FR:'fr', BR:'br', AR:'ar', US:'us', GB:'gb',
  SA:'sa', BE:'be', HR:'hr', PT:'pt', IT:'it', NL:'nl', PL:'pl', SN:'sn',
  MA:'ma', GH:'gh', TN:'tn', CM:'cm', NG:'ng', AU:'au', MX:'mx', CA:'ca',
  KR:'kr', QA:'qa', IR:'ir', EC:'ec', UY:'uy', CO:'co', PE:'pe', CV:'cv',
};

function FlagImg({ abbr }) {
  const key  = abbr?.toUpperCase();
  const code = FLAG[key];
  const [failed, setFailed] = useState(false);

  // Reset on abbr change
  useEffect(() => { setFailed(false); }, [abbr]);

  if (!code || failed) {
    return <span className={styles.flagFallback}>{key?.slice(0, 3) ?? '??'}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/20x15/${code}.png`}
      alt={abbr}
      className={styles.flag}
      onError={() => setFailed(true)}
    />
  );
}

function matchDate(utcDate) {
  const d = new Date(utcDate);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function matchTime(utcDate) {
  return new Date(utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function TickerItems({ matches }) {
  return (
    <>
      {matches.map((m, i) => {
        const isLive   = m.status === 'IN_PLAY' || m.status === 'PAUSED';
        const isFinished = m.status === 'FINISHED';
        const score    = getScore(m);
        // Use abbr (3-letter ESPN/FIFA code) for flag lookup; fall back to first 3 chars of name
        const homeAbbr = m.homeTeam.abbr || m.homeTeam.name?.slice(0, 3).toUpperCase() || '?';
        const awayAbbr = m.awayTeam.abbr || m.awayTeam.name?.slice(0, 3).toUpperCase() || '?';
        // Short display name: prefer 3-letter abbr, else first 3 chars of shortName
        const homeDisp = (m.homeTeam.abbr && m.homeTeam.abbr.length <= 3) ? m.homeTeam.abbr : m.homeTeam.shortName?.slice(0, 3).toUpperCase() || homeAbbr;
        const awayDisp = (m.awayTeam.abbr && m.awayTeam.abbr.length <= 3) ? m.awayTeam.abbr : m.awayTeam.shortName?.slice(0, 3).toUpperCase() || awayAbbr;

        return (
          <span key={m.id} className={styles.item}>
            {/* Date & time pill */}
            <span className={styles.matchTime}>
              {isLive
                ? <><span className={styles.liveDot} />{m.minute || 'LIVE'}</>
                : isFinished
                ? <span className={styles.ftLabel}>FT</span>
                : <>{matchDate(m.utcDate)} · {matchTime(m.utcDate)}</>}
            </span>

            {/* Home team */}
            <FlagImg abbr={homeAbbr} />
            <span className={styles.teamTxt}>{homeDisp}</span>

            {/* Score / vs */}
            <span className={`${styles.scoreTxt} ${isLive ? styles.scoreLive : ''}`}>{score}</span>

            {/* Away team */}
            <span className={styles.teamTxt}>{awayDisp}</span>
            <FlagImg abbr={awayAbbr} />

            {i < matches.length - 1 && <span className={styles.sep} />}
          </span>
        );
      })}
    </>
  );
}

export default function NavTicker() {
  const [matches, setMatches] = useState([]);
  const [hasLive, setHasLive] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      // Show today's matches; fall back to next 3 upcoming if none today
      let data = await getTodayMatches();
      if (data.length === 0) {
        const all = await getAllMatches();
        const now = Date.now();
        data = all.filter(m => new Date(m.utcDate).getTime() > now).slice(0, 5);
      }
      setMatches(data);
      setHasLive(data.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED'));
    } catch { /* silent */ }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  if (matches.length === 0) return null;

  return (
    <div
      className={`${styles.ticker} ${hasLive ? styles.hasLive : ''}`}
      onClick={() => navigate('/fifa-live')}
      role="button"
      tabIndex={0}
      title="FIFA World Cup 2026"
    >
      <div className={styles.label}>
        {hasLive
          ? <><div className={styles.pulseDot} /><span>LIVE</span></>
          : <><Trophy size={11} /><span>FIFA</span></>}
      </div>

      <div className={styles.track}>
        {/* Two identical copies side-by-side; animation translates -50% for seamless loop */}
        <div className={styles.inner}>
          <span className={styles.copy}><TickerItems matches={matches} /></span>
          <span className={styles.copy}><TickerItems matches={matches} /></span>
        </div>
      </div>
    </div>
  );
}
