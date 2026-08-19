import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/algorithmsList'

export default function AlgorithmCard({ algorithm }) {
  const category = CATEGORIES[algorithm.category]
  const CardInner = (
    <>
      <div style={styles.tab} aria-hidden="true">
        {String(algorithm.name).slice(0, 1)}
      </div>
      <div style={styles.body}>
        <div style={styles.categoryRow}>
          <span style={{ ...styles.dot, backgroundColor: category.color }} />
          <span style={styles.categoryLabel}>{category.label}</span>
        </div>
        <h3 style={styles.title}>{algorithm.name}</h3>
        <p style={styles.blurb}>{algorithm.blurb}</p>
        <span style={algorithm.implemented ? styles.badgeReady : styles.badgeSoon}>
          {algorithm.implemented ? 'Try it →' : 'Coming soon'}
        </span>
      </div>
    </>
  )

  if (!algorithm.implemented) {
    return <div style={{ ...styles.card, ...styles.cardDisabled }}>{CardInner}</div>
  }

  return (
    <Link to={algorithm.path} className="algo-card-link" style={{ ...styles.card, ...styles.cardLink }}>
      {CardInner}
    </Link>
  )
}

const styles = {
  card: {
    display: 'flex',
    gap: 14,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 18,
    transition: 'transform 120ms ease, box-shadow 120ms ease',
  },
  cardLink: {
    cursor: 'pointer',
  },
  cardDisabled: {
    opacity: 0.55,
  },
  tab: {
    flexShrink: 0,
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--marker-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 15,
  },
  body: { flex: 1, minWidth: 0 },
  categoryRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  dot: { width: 7, height: 7, borderRadius: '50%', display: 'inline-block' },
  categoryLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    margin: '0 0 4px 0',
    color: 'var(--ink)',
  },
  blurb: {
    fontFamily: 'var(--font-body)',
    fontSize: 13.5,
    color: 'var(--ink-soft)',
    margin: '0 0 10px 0',
    lineHeight: 1.4,
  },
  badgeReady: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--marker-blue)',
    fontWeight: 600,
  },
  badgeSoon: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-soft)',
  },
}
