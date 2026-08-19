import { ALGORITHMS, CATEGORIES } from '../data/algorithmsList'
import AlgorithmCard from '../components/common/AlgorithmCard'

export default function Home() {
  const categoryOrder = Object.keys(CATEGORIES)

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <header style={{ marginBottom: 48 }}>
        <div style={styles.eyebrow}>ALGO LAB</div>
        <h1 style={styles.h1}>Watch algorithms think.</h1>
        <p style={styles.subhead}>
          Ten classic algorithms, animated step by step — the way a professor
          would walk through them on a whiteboard, except you control the pace.
        </p>
      </header>

      {categoryOrder.map((catKey) => {
        const items = ALGORITHMS.filter((a) => a.category === catKey)
        if (items.length === 0) return null
        return (
          <section key={catKey} style={{ marginBottom: 40 }}>
            <div style={styles.sectionHeader}>
              <span
                style={{ ...styles.sectionDot, backgroundColor: CATEGORIES[catKey].color }}
              />
              <h2 style={styles.sectionTitle}>{CATEGORIES[catKey].label}</h2>
            </div>
            <div style={styles.grid}>
              {items.map((algo) => (
                <AlgorithmCard key={algo.id} algorithm={algo} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

const styles = {
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.12em',
    color: 'var(--marker-blue)',
    marginBottom: 10,
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(32px, 5vw, 48px)',
    margin: '0 0 14px 0',
    lineHeight: 1.05,
  },
  subhead: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    color: 'var(--ink-soft)',
    maxWidth: 560,
    lineHeight: 1.5,
    margin: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionDot: { width: 8, height: 8, borderRadius: '50%' },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    margin: 0,
    color: 'var(--ink-soft)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 14,
  },
}
