export const MediaToggle = ({ options = ['Movies', 'Series'], selected = 0, onChange }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      background: 'var(--bg-card)',
      padding: '4px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      width: 'fit-content'
    }}>
      {options.map((option, idx) => (
        <button
          key={option}
          onClick={() => onChange(idx)}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            background: selected === idx ? 'var(--accent)' : 'transparent',
            color: selected === idx ? 'var(--text-primary)' : 'var(--text-muted)'
          }}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
