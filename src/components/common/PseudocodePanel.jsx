import { useState } from 'react'
import { PSEUDOCODE } from '../../data/pseudocode'

/**
 * PseudocodePanel — Shows colour-coded pseudocode for an algorithm.
 *
 * Props:
 *   algorithmId  — key into PSEUDOCODE (e.g. 'bubble-sort')
 */

const KEYWORDS = ['function', 'if', 'else', 'for', 'while', 'return', 'do', 'break', 'continue', 'true', 'false', 'null', 'new']

function tokenizeLine(line) {
  if (!line.trim()) return [{ type: 'plain', text: ' ' }]
  if (line.trimStart().startsWith('#')) return [{ type: 'comment', text: line }]

  const tokens = []
  let remaining = line
  let leadingSpaces = ''

  // Extract leading whitespace
  const wsMatch = remaining.match(/^(\s+)/)
  if (wsMatch) {
    leadingSpaces = wsMatch[1]
    remaining = remaining.slice(leadingSpaces.length)
    tokens.push({ type: 'plain', text: leadingSpaces })
  }

  // Simple tokenizer: check for keyword at start
  const wordMatch = remaining.match(/^([a-zA-Z_]\w*)(.*)/)
  if (wordMatch) {
    const word = wordMatch[1]
    const rest = wordMatch[2]
    if (KEYWORDS.includes(word)) {
      tokens.push({ type: 'keyword', text: word })
      tokens.push(...tokenizeRest(rest))
    } else {
      tokens.push({ type: 'plain', text: word })
      tokens.push(...tokenizeRest(rest))
    }
  } else {
    tokens.push(...tokenizeRest(remaining))
  }

  return tokens
}

function tokenizeRest(str) {
  if (!str) return []
  const tokens = []
  // Highlight numbers
  const parts = str.split(/(\b\d+\b)/)
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      tokens.push({ type: 'number', text: part })
    } else if (part.includes('"') || part.includes("'")) {
      tokens.push({ type: 'string', text: part })
    } else {
      tokens.push({ type: 'plain', text: part })
    }
  }
  return tokens
}

export default function PseudocodePanel({ algorithmId }) {
  const [open, setOpen] = useState(true)
  const lines = PSEUDOCODE[algorithmId]

  if (!lines) return null

  return (
    <div style={styles.wrap}>
      <button style={styles.header} onClick={() => setOpen(o => !o)}>
        <span style={styles.headerTitle}>
          <span style={styles.icon}>≡</span>
          Pseudocode
        </span>
        <span style={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={styles.body}>
          <pre style={styles.pre}>
            {lines.map((line, i) => {
              const tokens = tokenizeLine(line)
              return (
                <div key={i} style={styles.line}>
                  <span style={styles.lineNum}>{i + 1}</span>
                  {tokens.map((tok, j) => (
                    <span key={j} style={tokenStyle(tok.type)}>
                      {tok.text}
                    </span>
                  ))}
                </div>
              )
            })}
          </pre>
        </div>
      )}
    </div>
  )
}

function tokenStyle(type) {
  switch (type) {
    case 'keyword': return { color: '#ff7b72', fontWeight: 600 }   // red – keywords
    case 'comment': return { color: '#8b949e', fontStyle: 'italic' } // dim – comments
    case 'number':  return { color: '#79c0ff' }                     // blue – numbers
    case 'string':  return { color: '#a5d6ff' }                     // light blue – strings
    default:        return { color: '#e6edf3' }
  }
}

const styles = {
  wrap: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    marginTop: 24,
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'var(--surface-2)',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    color: 'var(--ink)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 14,
  },
  icon: {
    fontFamily: 'var(--font-mono)',
    fontSize: 16,
    color: 'var(--marker-amber)',
  },
  chevron: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-soft)',
  },
  body: {
    padding: '4px 0',
    overflowX: 'auto',
  },
  pre: {
    margin: 0,
    padding: '8px 0',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    background: 'transparent',
  },
  line: {
    display: 'flex',
    alignItems: 'baseline',
    paddingRight: 16,
    minHeight: '1.7em',
    whiteSpace: 'pre',
  },
  lineNum: {
    display: 'inline-block',
    minWidth: 36,
    paddingLeft: 12,
    paddingRight: 12,
    color: '#484f58',
    userSelect: 'none',
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    flexShrink: 0,
  },
}
