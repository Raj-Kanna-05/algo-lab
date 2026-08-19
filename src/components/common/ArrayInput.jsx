/**
 * ArrayInput — reusable comma-separated number input for sorting pages
 */
import { useState } from 'react'

export default function ArrayInput({ label = 'Custom array', defaultValue, onRun }) {
  const [text, setText]   = useState(defaultValue.join(', '))
  const [error, setError] = useState('')

  function handleRun() {
    const nums = text
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))

    if (nums.length < 2)  return setError('Enter at least 2 numbers.')
    if (nums.length > 20) return setError('Maximum 20 numbers.')
    if (nums.some(n => n < 1 || n > 999)) return setError('Each number must be between 1 and 999.')

    setError('')
    onRun(nums)
  }

  return (
    <div style={styles.wrap}>
      <span style={styles.label}>{label}</span>
      <div style={styles.row}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRun()}
          placeholder="e.g. 8, 3, 7, 4, 9, 1"
          style={styles.input}
          spellCheck={false}
        />
        <button style={styles.btn} onClick={handleRun} id="array-input-run">
          Run ▶
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 20,
    padding: '14px 16px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
  },
  row: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--input-bg)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    outline: 'none',
  },
  btn: {
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    background: 'var(--marker-blue)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 13,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  error: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--marker-red)',
  },
}
