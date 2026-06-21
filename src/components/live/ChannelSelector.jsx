import { useState, useEffect } from 'react';
import { CHANNELS, DISCLAIMER } from '../../utils/streamLinks.js';
import styles from '../../styles/ChannelSelector.module.css';

export default function ChannelSelector() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [countdown, setCountdown] = useState(DISCLAIMER.countdownSeconds);
  const [selectedId, setSelectedId] = useState(null);

  // Countdown timer for disclaimer button
  useEffect(() => {
    if (!showDisclaimer || countdown === 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showDisclaimer, countdown]);

  const handleChannelClick = (channel) => {
    setSelectedId(channel.id);
    window.open(channel.url, '_blank', 'noopener,noreferrer');
  };

  const featuredChannel = CHANNELS.find(c => c.featured);
  const otherChannels = CHANNELS.filter(c => !c.featured);

  return (
    <div className={styles.wrapper}>
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>📋</div>
            <h2 className={styles.modalTitle}>{DISCLAIMER.title}</h2>
            <p className={styles.modalBody}>{DISCLAIMER.body}</p>
            <p className={styles.modalSub}>{DISCLAIMER.sub}</p>
            <button
              className={styles.modalBtn}
              onClick={() => setShowDisclaimer(false)}
              disabled={countdown > 0}
            >
              {countdown > 0
                ? `I Understand (${countdown}s)`
                : '✓ I Understand — Show Channels'}
            </button>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>📺 Watch Live — Official Sources</h2>
        <p className={styles.subtitle}>
          All links open the official broadcaster's platform in a new tab.
          100% legal — no unauthorized streams.
        </p>
      </div>

      {/* Featured Channel (T Sports) */}
      {featuredChannel && (
        <div className={styles.featured}>
          <div className={styles.featuredLeft}>
            <div
              className={styles.featuredLogoWrap}
              style={{ background: featuredChannel.logoColor }}
            >
              <img
                src={featuredChannel.logo}
                alt={featuredChannel.name}
                className={styles.featuredLogo}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Emoji fallback — hidden by default, shown on img error */}
              <div className={styles.logoEmojiFallback}>
                {featuredChannel.logoFallback}
              </div>
            </div>

            <div className={styles.featuredInfo}>
              <div className={styles.featuredTopRow}>
                <div className={styles.featuredName}>{featuredChannel.name}</div>
                <div className={styles.officialBadge}>⭐ Recommended for Bangladesh</div>
                <div
                  className={styles.tagBadge}
                  style={{ borderColor: featuredChannel.tagColor, color: featuredChannel.tagColor }}
                >
                  {featuredChannel.tag}
                </div>
              </div>

              <p className={styles.featuredDesc}>{featuredChannel.description}</p>
              <p className={styles.featuredRegion}>{featuredChannel.flag} {featuredChannel.region}</p>
            </div>
          </div>

          <div className={styles.featuredBtns}>
            <a
              href={featuredChannel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
              onClick={() => setSelectedId(featuredChannel.id)}
            >
              🌐 Watch on Website
            </a>
            {featuredChannel.youtubeUrl && (
              <a
                href={featuredChannel.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnOutline}
              >
                ▶ Watch on YouTube
              </a>
            )}
          </div>
        </div>
      )}

      {/* Other Channels Grid */}
      <div className={styles.grid}>
        {otherChannels.map(channel => (
          <div
            key={channel.id}
            className={`${styles.channelCard} ${selectedId === channel.id ? styles.activeCard : ''}`}
            onClick={() => handleChannelClick(channel)}
          >
            <div
              className={styles.logoWrap}
              style={{ background: channel.logoColor }}
            >
              <img
                src={channel.logo}
                alt={channel.name}
                className={styles.logo}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Emoji fallback — hidden by default, shown on img error */}
              <div className={styles.logoEmojiFallback}>
                {channel.logoFallback}
              </div>
            </div>
            <div className={styles.channelName}>{channel.name}</div>
            <div className={styles.channelSub}>{channel.subtitle}</div>
            <div
              className={styles.tag}
              style={{ borderColor: channel.tagColor, color: channel.tagColor }}
            >
              {channel.tag}
            </div>
            <div className={styles.channelFlag}>{channel.flag}</div>
            <div className={styles.externalArrow}>↗</div>
          </div>
        ))}
      </div>

      {/* Legal Footer */}
      <div className={styles.legalFooter}>
        <div className={styles.legalIcon}>✅</div>
        <p>
          <strong>Legal Notice:</strong> BTV, Somoy TV and T Sports jointly purchased
          FIFA World Cup 2026 broadcast rights directly from FIFA for Bangladesh.
          Toffee (Banglalink) and Bioscope+ (Grameenphone) are licensed sub-distributors.
          This page only links to their official platforms.
        </p>
      </div>
    </div>
  );
}
