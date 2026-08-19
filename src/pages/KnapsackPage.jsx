import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { knapsack, DEFAULT_ITEMS, DEFAULT_CAPACITY } from '../algorithms/dp/knapsack'
import KnapsackTable from '../components/dp/KnapsackTable'
import PlaybackControls from '../components/common/PlaybackControls'

export default function KnapsackPage() {
  const steps = useMemo(() => knapsack(DEFAULT_ITEMS, DEFAULT_CAPACITY), [])

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(500)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const step = steps[currentStep]

  const decisionColor = {
    compare:  'var(--marker-amber)',
    skip:     'var(--marker-blue)',
    take:     'var(--marker-green)',
    solution: 'var(--marker-green)',
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.eyebrow}>DYNAMIC PROGRAMMING</div>
      <h1 style={styles.h1}>0/1 Knapsack Problem</h1>

      <p style={styles.description}>
        You have a bag with a weight limit of <strong>{DEFAULT_CAPACITY}</strong> and a set of items,
        each with a weight and a value. Which items do you pack to <strong>maximise total value</strong>{' '}
        without exceeding the limit? DP solves this by filling a table where each cell
        answers "best value using the first <em>i</em> items with capacity <em>w</em>."
      </p>

      {/* Item list sidebar */}
      <div style={styles.itemRow}>
        {DEFAULT_ITEMS.map((item, i) => (
          <div key={i} style={{
            ...styles.itemBadge,
            ...(step.selected && step.selected.has(i) ? styles.itemBadgeSelected : {}),
          }}>
            <span style={styles.itemName}>{item.name}</span>
            <span style={styles.itemMeta}>w={item.weight} v={item.value}</span>
          </div>
        ))}
      </div>

      {step.decision && (
        <div style={styles.decisionBadge}>
          <span style={styles.decisionLabel}>Decision:</span>
          <span style={{ ...styles.decisionValue, color: decisionColor[step.decision] ?? 'var(--ink)' }}>
            {step.decision}
          </span>
        </div>
      )}

      <div style={styles.panel}>
        <KnapsackTable step={step} />
      </div>

      <p style={styles.note}>{step.note}</p>

      <PlaybackControls
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speedMs={speedMs}
        onStepChange={handleStepChange}
        onPlayingChange={setIsPlaying}
        onSpeedChange={setSpeedMs}
      />
    </div>
  )
}

const styles = {
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-green)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  itemRow: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  itemBadge: { padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 2, transition: 'border-color 180ms ease, background 180ms ease' },
  itemBadgeSelected: { background: '#e6faf3', borderColor: 'var(--marker-green)' },
  itemName: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 },
  itemMeta: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' },
  decisionBadge: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', width: 'fit-content' },
  decisionLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  decisionValue: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'capitalize' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflowX: 'auto' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
