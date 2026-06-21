export const ErrorMessage = ({ message = 'Couldn\'t load content. Please try again.', onRetry }) => {
  return (
    <div style={{
      background: 'rgba(229, 9, 20, 0.1)',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      textAlign: 'center',
      margin: '24px 0',
      color: '#ff6b6b'
    }}>
      <p style={{ marginBottom: onRetry ? '12px' : '0' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'var(--accent)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            transition: 'background var(--transition)'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
        >
          Try Again
        </button>
      )}
    </div>
  )
}
