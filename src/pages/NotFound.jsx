import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found — yourmovielive'
  }, [])

  const navigate = useNavigate()

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 24px',
      textAlign: 'center',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: '72px',
        color: 'var(--accent)',
        marginBottom: '16px',
        letterSpacing: '2px'
      }}>
        404
      </h1>

      <h2 style={{
        fontSize: '28px',
        color: 'var(--text-primary)',
        marginBottom: '16px'
      }}>
        Page Not Found
      </h2>

      <p style={{
        fontSize: '16px',
        color: 'var(--text-secondary)',
        marginBottom: '32px',
        maxWidth: '500px'
      }}>
        The page you're looking for doesn't exist. Let's get you back on track.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          background: 'var(--accent)',
          color: 'var(--text-primary)',
          border: 'none',
          padding: '12px 32px',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '16px',
          transition: 'background var(--transition)'
        }}
        onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
        onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
      >
        Back to Home
      </button>
    </div>
  )
}
