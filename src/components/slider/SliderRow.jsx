import { useRef, useState, useCallback } from "react";
import { SliderCard } from "./SliderCard.jsx";
import styles from "../../styles/SliderRow.module.css";

export const SliderRow = ({ items, showRank = false, mediaType = "movie", isLandscape = false }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, offsetWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - offsetWidth - 10);
  }, []);

  const scroll = useCallback(
    (direction) => {
      if (!containerRef.current) return;
      const scrollAmount = containerRef.current.offsetWidth * 0.75;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 100);
    },
    [checkScroll],
  );

  return (
    <div className={styles.wrapper}>
      {canScrollLeft && (
        <button
          className={`${styles.arrow} ${styles.left}`}
          onClick={() => scroll("left")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div
        data-scroll-disable
        className={styles.container}
        ref={containerRef}
        onScroll={checkScroll}
        onLoad={checkScroll}
      >
        {items.map((item) => (
          <div key={`${item.id}`} className={styles.item}>
            <SliderCard
              item={item}
              rank={showRank ? item.rank : null}
              mediaType={item.media_type || mediaType}
              isLandscape={isLandscape}
            />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          className={`${styles.arrow} ${styles.right}`}
          onClick={() => scroll("right")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
};
