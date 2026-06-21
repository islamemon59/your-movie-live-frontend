import { useNavigate } from 'react-router-dom'
import styles from '../../styles/Footer.module.css'

export const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <img src="/your-movie-live-logo.png" alt="yourmovielive" className={styles.logo} onError={e => { e.target.style.display = 'none' }} />
            <p className={styles.tagline}>Watch movies &amp; TV shows free, anytime.</p>
          </div>

          <div className={styles.linkGroups}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Browse</h4>
              <button onClick={() => navigate('/movies')}>Movies</button>
              <button onClick={() => navigate('/shows')}>TV Shows</button>
              <button onClick={() => navigate('/kids')}>Kids</button>
              <button onClick={() => navigate('/anime')}>Anime</button>
              <button onClick={() => navigate('/fifa-live')}>FIFA Live</button>
            </div>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Account</h4>
              <button onClick={() => navigate('/watchlist')}>My Watchlist</button>
              <button onClick={() => navigate('/history')}>Watch History</button>
              <button onClick={() => navigate('/search')}>Search</button>
            </div>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Genres</h4>
              <button onClick={() => navigate('/category/28/Action')}>Action</button>
              <button onClick={() => navigate('/category/27/Horror')}>Horror</button>
              <button onClick={() => navigate('/category/10749/Romance')}>Romance</button>
              <button onClick={() => navigate('/category/878/Sci-Fi')}>Sci-Fi</button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>Data provided by <strong>TMDB</strong>. This site does not host any content.</p>
          <p>&copy; 2026 yourmovielive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
