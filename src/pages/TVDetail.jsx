import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTMDB } from "../hooks/useTMDB.js";
import { useWatchlistContext } from "../context/WatchlistContext.jsx";
import { useUserPreferences } from "../context/UserPreferencesContext.jsx";
import { getTVDetails, getTVSeason, getMovieTrailer } from "../utils/tmdb.js";
import { DownloadButton } from "../components/ui/DownloadButton.jsx";
import { HowToDownload } from "../components/ui/HowToDownload.jsx";
import { BookmarkPlus, Bookmark } from "lucide-react";
import { TrailerBanner } from "../components/detail/TrailerBanner.jsx";
import { MediaInfo } from "../components/detail/MediaInfo.jsx";
import Player from "../components/detail/Player.jsx";
import { CastSection } from "../components/detail/CastSection.jsx";
import { SliderRow } from "../components/slider/SliderRow.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { ErrorMessage } from "../components/ui/ErrorMessage.jsx";
import styles from "../styles/TVDetail.module.css";

const TVDetail = () => {
  const { id } = useParams();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const { data: tv, loading, error } = useTMDB(() => getTVDetails(id), [id]);
  const { data: seasonData } = useTMDB(
    () => getTVSeason(id, selectedSeason),
    [id, selectedSeason],
  );
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlistContext();
  const { recordPlay } = useUserPreferences();

  useEffect(() => {
    setSelectedEpisode(1);
  }, [selectedSeason]);

  useEffect(() => {
    if (tv?.name) {
      document.title = `${tv.name} — YourMovieLive`;
    }
  }, [tv]);

  useEffect(() => {
    if (tv?.id) {
      setIsInList(isInWatchlist(tv.id, "tv"));
    }
  }, [tv?.id, isInWatchlist]);

  const handleWatchlistToggle = () => {
    if (isInList) {
      removeFromWatchlist(tv.id, "tv");
      setIsInList(false);
    } else {
      addToWatchlist({ ...tv, media_type: "tv" });
      setIsInList(true);
    }
  };

  const handleEpisodeSelect = (episodeNum) => {
    setSelectedEpisode(episodeNum);
    setShowPlayer(true);
    const ep = (seasonData?.episodes || []).find(e => e.episode_number === episodeNum);
    recordPlay(
      { ...tv, media_type: 'tv' },
      selectedSeason,
      episodeNum,
      ep?.name || null
    );
    setTimeout(() => {
      document.getElementById("player-section")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!tv) return <ErrorMessage message="TV show not found" />;

  const trailerKey = getMovieTrailer(tv.videos);
  const episodes = seasonData?.episodes || [];

  return (
    <main style={{ background: "var(--bg-primary)" }}>
      <TrailerBanner trailerKey={trailerKey} backdropPath={tv.backdrop_path}>
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "64px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 12px 0",
              lineHeight: "0.9",
            }}
          >
            {tv.name}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              margin: "0 0 16px 0",
            }}
          >
            {tv.number_of_seasons} Seasons · {tv.number_of_episodes} Episodes
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={handleWatchlistToggle}
              style={{
                background: isInList ? "var(--accent)" : "transparent",
                color: "var(--text-primary)",
                padding: "12px 32px",
                borderRadius: "var(--radius)",
                border: `2px solid ${isInList ? "var(--accent)" : "var(--text-primary)"}`,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all var(--transition)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isInList ? <Bookmark size={16} /> : <BookmarkPlus size={16} />}
              {isInList ? "WATCHLIST" : "+ WATCHLIST"}
            </button>

            <DownloadButton
              tmdbId={parseInt(id)}
              title={tv.name}
              mediaType="tv"
              season={selectedSeason}
              episode={selectedEpisode}
            />

            <HowToDownload mediaType="tv" />
          </div>
        </div>
      </TrailerBanner>

      <div className={styles.container}>
        <MediaInfo media={tv} mediaType="tv" />

        <div style={{ margin: "40px 0" }}>
          <h3
            style={{
              marginBottom: "16px",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            Season
          </h3>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {Array.from({ length: tv.number_of_seasons }, (_, i) => i + 1).map(
              (season) => (
                <option key={season} value={season}>
                  Season {season}
                </option>
              ),
            )}
          </select>
        </div>

        {episodes.length > 0 && (
          <div style={{ margin: "40px 0", marginBottom: "60px" }}>
            <h3
              style={{
                marginBottom: "16px",
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Episodes
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "16px",
              }}
            >
              {episodes.map((episode) => (
                <button
                  key={episode.episode_number}
                  onClick={() => handleEpisodeSelect(episode.episode_number)}
                  style={{
                    padding: "12px",
                    background:
                      selectedEpisode === episode.episode_number && showPlayer
                        ? "var(--accent)"
                        : "var(--bg-card)",
                    border:
                      selectedEpisode === episode.episode_number && showPlayer
                        ? "none"
                        : "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    textAlign: "left",
                    transition: "all var(--transition)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <div style={{ marginBottom: "4px" }}>
                    E{episode.episode_number} - {episode.name}
                  </div>
                  {episode.runtime && (
                    <div style={{ fontSize: "11px", opacity: 0.7 }}>
                      {episode.runtime} min
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player — only renders when showPlayer is true */}
        {showPlayer && (
          <div style={{ margin: "0 0" }} id="player-section">
            <h2
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "28px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              WATCH S{selectedSeason} E{selectedEpisode}
            </h2>
            <Player
              tmdbId={parseInt(id)}
              mediaType="tv"
              season={selectedSeason}
              episode={selectedEpisode}
            />
            <button
              onClick={() => setShowPlayer(false)}
              style={{
                marginTop: "16px",
                background: "transparent",
                color: "var(--text-primary)",
                padding: "10px 24px",
                borderRadius: "var(--radius)",
                border: "2px solid var(--text-primary)",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all var(--transition)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Back to Episodes
            </button>
          </div>
        )}

        {tv.credits?.cast && <CastSection cast={tv.credits.cast} />}

        {tv.similar?.results && tv.similar.results.length > 0 && (
          <div style={{ margin: "60px 0" }}>
            <h2
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "28px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              MORE LIKE THIS
            </h2>
            <SliderRow items={tv.similar.results} mediaType="tv" />
          </div>
        )}

        <div style={{ height: "40px" }} />
      </div>
    </main>
  );
};

export default TVDetail;
