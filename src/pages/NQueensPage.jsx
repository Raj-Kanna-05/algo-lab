import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { nQueens } from '../algorithms/backtracking/nQueens'
import QueensBoard from '../components/backtracking/QueensBoard'
import PlaybackControls from '../components/common/PlaybackControls'
import PseudocodePanel from '../components/common/PseudocodePanel'
import CodeTabs from '../components/common/CodeTabs'

export default function NQueensPage() {
  const [n, setN]                     = useState(6)
  const [steps, setSteps]             = useState(() => nQueens(6))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(400)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  function handleNChange(newN) {
    setIsPlaying(false)
    setN(newN)
    setSteps(nQueens(newN))
    setCurrentStep(0)
  }

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
      <h1 style={styles.h1}>N-Queens ({n}×{n})</h1>

      <p style={styles.description}>
        Place {n} queens on a {n}×{n} chessboard so that no two queens attack each other
        (no shared row, column, or diagonal). The algorithm tries placing a queen column
        by column in each row. When a conflict arises, it <strong>backtracks</strong> —
        removes the last queen and tries a different column.
      </p>

      {/* ── N size selector ── */}
      <div style={styles.nSelectorCard}>
        <span style={styles.nSelectorLabel}>Board Size (N × N):</span>
        <div style={styles.nBtnRow}>
          {[4, 5, 6, 7, 8].map(size => (
            <button
              key={size}
              style={{ ...styles.nBtn, ...(n === size ? styles.nBtnActive : {}) }}
              onClick={() => handleNChange(size)}
              id={`nqueens-size-${size}`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

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

      <PseudocodePanel algorithmId="n-queens" />
      <CodeTabs algorithmId="n-queens" />
    </div>
  )
}

const styles = {
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-blue)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  nSelectorCard: { display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, flexWrap: 'wrap' },
  nSelectorLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  nBtnRow: { display: 'flex', gap: 8 },
  nBtn: { padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 },
  nBtnActive: { background: 'var(--marker-blue)', borderColor: 'var(--marker-blue)', color: '#fff' },
  phaseBadge: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', width: 'fit-content' },
  phaseLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  phaseValue: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'capitalize' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, display: 'inline-block' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
