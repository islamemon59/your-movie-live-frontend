import styles from '../styles/MovieCard.module.css'

export const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 24px',
      minHeight: '200px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
