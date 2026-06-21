export const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: 'var(--radius)',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  }

  const variants = {
    default: {
      ...baseStyle,
      background: 'var(--bg-card)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)'
    },
    accent: {
      ...baseStyle,
      background: 'var(--accent)',
      color: 'var(--text-primary)'
    },
    gold: {
      ...baseStyle,
      background: 'transparent',
      color: 'var(--gold)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  }

  return <span style={variants[variant] || variants.default} className={className}>
    {children}
  </span>
}
