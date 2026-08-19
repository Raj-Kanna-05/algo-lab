import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { bstDemo, DEFAULT_VALUES, DEFAULT_SEARCH } from '../algorithms/trees/bst'
import TreeDiagram from '../components/trees/TreeDiagram'
import PlaybackControls from '../components/common/PlaybackControls'

export default function BSTPage() {
  const steps = useMemo(() => bstDemo(DEFAULT_VALUES, DEFAULT_SEARCH), [])

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(700)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const step = steps[currentStep]

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.eyebrow}>TREES</div>
      <h1 style={styles.h1}>Binary Search Tree</h1>

      <p style={styles.description}>
        A Binary Search Tree keeps values in order: everything in the <strong>left subtree</strong>{' '}
        is smaller than the node, everything in the <strong>right subtree</strong> is larger.
        This makes searching very fast — at each node we immediately know which direction to go.
        We're inserting values {DEFAULT_VALUES.join(', ')}, then searching for {DEFAULT_SEARCH}.
      </p>

      <div style={styles.legend}>
        <LegendItem color="var(--marker-amber)" label="Currently visiting" bordered />
        <LegendItem color="var(--marker-green)" label="Found / Inserted" />
        <LegendItem color="#fff0ee"             label="Being removed" bordered />
      </div>

      <div style={styles.panel}>
        <TreeDiagram step={step} />
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

function LegendItem({ color, label, bordered }) {
  return (
    <div style={styles.legendItem}>
      <span style={{
        ...styles.legendDot,
        backgroundColor: color,
        border: bordered ? '1.5px solid var(--border)' : 'none',
      }} />
      <span style={styles.legendLabel}>{label}</span>
    </div>
  )
}

const styles = {
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-amber)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  legend: { display: 'flex', gap: 18, marginBottom: 16, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: '50%' },
  legendLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflowX: 'auto' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
