import { useEffect, useState, useCallback, useRef } from "react";
import { useTMDB } from "../../hooks/useTMDB.js";
import { getHighRated2026Movies } from "../../utils/tmdb.js";
import { Loader } from "../ui/Loader.jsx";
import { ErrorMessage } from "../ui/ErrorMessage.jsx";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { IMG } from "../../config.js";
import { Badge } from "../ui/Badge.jsx";
import styles from "../../styles/HeroBanner.module.css";

export const HeroBanner = ({ fetchFn = getHighRated2026Movies }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);

  // Keep a ref to latest items.length so interval never goes stale
  const itemsLengthRef = useRef(0);

  // "Observer" auto-refresh: re-pull the latest releases on an interval and
  // whenever the tab regains focus, so a long-open page keeps showing newly
  // released titles without a manual reload.
  useEffect(() => {
    const REFRESH_MS = 30 * 60 * 1000; // 30 min
    const id = setInterval(() => setRefreshKey((k) => k + 1), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") setRefreshKey((k) => k + 1);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const { data: slides, loading, error } = useTMDB(() => fetchFn(), [fetchFn, refreshKey]);
  const items = slides || [];

  // Keep ref in sync
  useEffect(() => {
    itemsLengthRef.current = items.length;
  }, [items.length]);

  const next = useCallback(() => {
    if (itemsLengthRef.current === 0) return;
    setCurrentSlide((prev) => (prev + 1) % itemsLengthRef.current);
  }, []);

  const prev = useCallback(() => {
    if (itemsLengthRef.current === 0) return;
    setCurrentSlide((prev) => (prev - 1 + itemsLengthRef.current) % itemsLengthRef.current);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const handleBannerClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    e.clientX - rect.left < rect.width / 2 ? prev() : next();
  };

  // Auto-rotation: stable interval, reads latest length via ref. Keeps running
  // even while the cursor is over the banner (no pause-on-hover).
  useEffect(() => {
    // Don't start until data is loaded
    if (items.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % itemsLengthRef.current);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // Only re-run when data first loads
  }, [items.length > 0]);

  // Only show the loader/error on the very first load — keep the current slides
  // on screen while a background refresh fetches newer releases.
  if (loading && items.length === 0) return <Loader />;
  if (error && items.length === 0) return <ErrorMessage message={error} />;
  if (items.length === 0) return null;

  const currentItem = items[currentSlide];
  if (!currentItem) return null;

  return (
    <div
      ref={containerRef}
      className={styles.hero}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleBannerClick}
      style={{ cursor: "pointer" }}
    >
      {/* All slides stacked — only active one visible, CSS handles fade */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={styles.backgroundContainer}
          style={{
            backgroundImage: `url(${IMG.backdrop(item.backdrop_path)})`,
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 2 : 1,
          }}
        />
      ))}

      <div className={styles.gradient} />

      <div className={styles.content} style={{ pointerEvents: "none" }}>
        <h1 className={styles.title}>{currentItem.title}</h1>

        <div className={styles.meta}>
          <Badge variant="gold">⭐ {currentItem.vote_average?.toFixed(1)}</Badge>
          {currentItem.release_date && (
            <span className={styles.year}>{currentItem.release_date.slice(0, 4)}</span>
          )}
        </div>

        {currentItem.genres?.length > 0 && (
          <div className={styles.genres}>
            {currentItem.genres.slice(0, 3).map((genre) => (
              <Badge key={genre.id} variant="default" className={styles.genreBadge}>
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        <p className={styles.overview}>{currentItem.overview}</p>

        <div className={styles.buttons} style={{ pointerEvents: "auto" }}>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${currentItem.media_type || "movie"}/${currentItem.id}`);
            }}
          >
            <Play size={20} style={{ marginRight: "8px" }} />
            PLAY NOW
          </button>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className={styles.dots} style={{ pointerEvents: "auto" }}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};