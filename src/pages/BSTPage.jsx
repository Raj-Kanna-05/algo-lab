import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { bstDemo, DEFAULT_VALUES, DEFAULT_SEARCH } from '../algorithms/trees/bst'
import TreeDiagram from '../components/trees/TreeDiagram'
import PlaybackControls from '../components/common/PlaybackControls'
import PseudocodePanel from '../components/common/PseudocodePanel'
import CodeTabs from '../components/common/CodeTabs'

export default function BSTPage() {
  const [insertText, setInsertText]   = useState(DEFAULT_VALUES.join(', '))
  const [searchValText, setSearchValText] = useState(String(DEFAULT_SEARCH))
  const [error, setError]             = useState('')

  const [values, setValues]           = useState(DEFAULT_VALUES)
  const [searchTarget, setSearchTarget] = useState(DEFAULT_SEARCH)
  const [steps, setSteps]             = useState(() => bstDemo(DEFAULT_VALUES, DEFAULT_SEARCH))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(700)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  function handleRun() {
    const nums = insertText
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))

    const target = parseInt(searchValText.trim(), 10)

    if (nums.length < 1)  return setError('Enter at least 1 value to insert.')
    if (nums.length > 15) return setError('Maximum 15 nodes for visual clarity.')
    if (isNaN(target))    return setError('Enter a valid target number to search for.')

    setError('')
    setIsPlaying(false)
    setValues(nums)
    setSearchTarget(target)
    setSteps(bstDemo(nums, target))
    setCurrentStep(0)
    setIsPlaying(true) // Automatically start playback!
  }

  const step = steps[currentStep]

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.eyebrow}>TREES</div>
      <h1 style={styles.h1}>Binary Search Tree</h1>

      <p style={styles.description}>
        A Binary Search Tree keeps values in order: everything in the <strong>left subtree</strong>{' '}
        is smaller than the node, everything in the <strong>right subtree</strong> is larger.
      </p>

      {/* ── Custom inputs ── */}
      <div style={styles.inputCard}>
        <div style={styles.inputRow}>
          <div style={{ flex: 2 }}>
            <label style={styles.inputLabel}>Values to Insert</label>
            <input
              type="text"
              value={insertText}
              onChange={e => setInsertText(e.target.value)}
              placeholder="e.g. 5, 3, 7, 1, 4"
              style={styles.textInput}
            />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={styles.inputLabel}>Search Target</label>
            <input
              type="number"
              value={searchValText}
              onChange={e => setSearchValText(e.target.value)}
              placeholder="e.g. 4"
              style={styles.textInput}
            />
          </div>
          <button style={styles.runBtn} onClick={handleRun} id="bst-run-btn">
            Build & Search ▶
          </button>
        </div>
        {error && <p style={styles.errorText}>{error}</p>}
      </div>

      <div style={styles.legend}>
        <LegendItem color="var(--marker-amber)" label="Currently visiting" bordered />
        <LegendItem color="var(--marker-green)" label="Found / Inserted" />
        <LegendItem color="var(--tint-red)"     label="Being removed" bordered />
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

      <PseudocodePanel algorithmId="bst" />
      <CodeTabs algorithmId="bst" />
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
  inputCard: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 },
  inputRow: { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' },
  inputLabel: { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 },
  textInput: { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 13 },
  runBtn: { padding: '9px 20px', borderRadius: 8, border: 'none', background: 'var(--marker-blue)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer' },
  errorText: { margin: '8px 0 0', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--marker-red)' },
  legend: { display: 'flex', gap: 18, marginBottom: 16, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: '50%' },
  legendLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflowX: 'auto' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
