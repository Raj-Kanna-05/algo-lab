import { useState } from 'react'
import { CODE_SNIPPETS } from '../../data/codeSnippets'

/**
 * CodeTabs — Language-switchable code panel for Python / Java / C++
 *
 * Props:
 *   algorithmId — key into CODE_SNIPPETS (e.g. 'bubble-sort')
 */

const LANGS = [
  { id: 'python', label: 'Python',  icon: '🐍' },
  { id: 'java',   label: 'Java',    icon: '☕' },
  { id: 'cpp',    label: 'C++',     icon: '⚡' },
]

export default function CodeTabs({ algorithmId }) {
  const [activeLang, setActiveLang] = useState('python')
  const [open, setOpen]             = useState(true)

  const snippets = CODE_SNIPPETS[algorithmId]
  if (!snippets) return null

  const code = snippets[activeLang] ?? '// Not available'

  return (
    <div style={styles.wrap}>
      {/* Header row: title + collapse toggle */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <span style={styles.icon}>{'</>'}</span>
          <span style={styles.title}>Code</span>
        </div>
        <div style={styles.topRight}>
          {/* Language tabs always visible */}
          <div style={styles.langTabs}>
            {LANGS.map(lang => (
              <button
                key={lang.id}
                style={{
                  ...styles.langTab,
                  ...(activeLang === lang.id ? styles.langTabActive : {}),
                }}
                onClick={() => { setActiveLang(lang.id); setOpen(true) }}
                id={`code-tab-${algorithmId}-${lang.id}`}
              >
                {lang.icon} {lang.label}
              </button>
            ))}
          </div>
          <button style={styles.toggleBtn} onClick={() => setOpen(o => !o)}>
            {open ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Code body */}
      {open && (
        <div style={styles.body}>
          <pre style={styles.pre}>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'var(--surface-2)',
    borderBottom: '1px solid var(--border)',
    gap: 10,
    flexWrap: 'wrap',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--marker-green)',
    fontWeight: 700,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 14,
    color: 'var(--ink)',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  langTabs: {
    display: 'flex',
    gap: 4,
    background: 'var(--bg)',
    borderRadius: 8,
    padding: '3px',
    border: '1px solid var(--border)',
  },
  langTab: {
    padding: '5px 12px',
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'background 120ms ease, color 120ms ease',
    whiteSpace: 'nowrap',
  },
  langTabActive: {
    background: 'var(--surface)',
    color: 'var(--ink)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
  },
  toggleBtn: {
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    cursor: 'pointer',
  },
  body: {
    overflowX: 'auto',
  },
  pre: {
    margin: 0,
    padding: '16px 20px',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    color: '#e6edf3',
    background: '#0d1117',
    whiteSpace: 'pre',
    tabSize: 4,
  },
}
