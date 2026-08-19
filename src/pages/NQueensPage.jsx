import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { nQueens, DEFAULT_N } from '../algorithms/backtracking/nQueens'
import QueensBoard from '../components/backtracking/QueensBoard'
import PlaybackControls from '../components/common/PlaybackControls'

export default function NQueensPage() {
  const steps = useMemo(() => nQueens(DEFAULT_N), [])

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(400)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const step = steps[currentStep]

  const phaseColors = {
    place:     'var(--marker-green)',
    conflict:  'var(--marker-red)',
    backtrack: 'var(--marker-red)',
    solution:  'var(--marker-green)',
    try:       'var(--marker-amber)',
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.eyebrow}>BACKTRACKING</div>
      <h1 style={styles.h1}>N-Queens ({DEFAULT_N}×{DEFAULT_N})</h1>

      <p style={styles.description}>
        Place {DEFAULT_N} queens on a {DEFAULT_N}×{DEFAULT_N} chessboard so that no two queens
        attack each other (no shared row, column, or diagonal). The algorithm tries
        placing a queen column by column in each row. When a conflict arises,
        it <strong>backtracks</strong> — removes the last queen and tries a different column.
      </p>

      <div style={styles.phaseBadge}>
        <span style={styles.phaseLabel}>Current action:</span>
        <span style={{ ...styles.phaseValue, color: phaseColors[step.phase] ?? 'var(--ink)' }}>
          {step.phase}
        </span>
      </div>

      <div style={styles.panel}>
        <QueensBoard step={step} />
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
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-blue)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  phaseBadge: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', width: 'fit-content' },
  phaseLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  phaseValue: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'capitalize' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, display: 'inline-block' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
