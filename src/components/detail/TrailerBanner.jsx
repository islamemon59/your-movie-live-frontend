import { useState, useEffect } from 'react'
import styles from '../../styles/TrailerBanner.module.css'
import { IMG } from '../../config.js'

export const TrailerBanner = ({ trailerKey, backdropPath, children }) => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  // Reset state whenever the trailer changes (navigating between titles)
  useEffect(() => {
    setVideoLoaded(false)
    setVideoFailed(false)
  }, [trailerKey])

  // YouTube sends postMessage errors when a video is unavailable or unembeddable
  useEffect(() => {
    if (!trailerKey) return
    const handleMessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.event === 'onError') setVideoFailed(true)
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [trailerKey])

  const useVideo = trailerKey && !videoFailed

  return (
    <div className={styles.container}>
      {useVideo ? (
        <>
          <iframe
            className={`${styles.video} ${videoLoaded ? styles.loaded : ''}`}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            onLoad={() => setVideoLoaded(true)}
          />
          {/* Absorbs all mouse events so YouTube never shows its control bar */}
          <div className={styles.videoBlocker} />
        </>
      ) : (
        <div
          className={styles.backdrop}
          style={{
            backgroundImage: `url(${IMG.backdrop(backdropPath)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
