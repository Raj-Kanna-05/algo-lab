import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { knapsack, DEFAULT_ITEMS, DEFAULT_CAPACITY } from '../algorithms/dp/knapsack'
import KnapsackTable from '../components/dp/KnapsackTable'
import PlaybackControls from '../components/common/PlaybackControls'
import PseudocodePanel from '../components/common/PseudocodePanel'
import CodeTabs from '../components/common/CodeTabs'

export default function KnapsackPage() {
  const [items, setItems]             = useState(DEFAULT_ITEMS)
  const [capacity, setCapacity]       = useState(DEFAULT_CAPACITY)
  const [steps, setSteps]             = useState(() => knapsack(DEFAULT_ITEMS, DEFAULT_CAPACITY))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(500)
  const [error, setError]             = useState('')

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  function handleItemChange(index, field, value) {
    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === 'name' ? value : Math.max(1, parseInt(value, 10) || 1),
        }
      }
      return item
    })
    setItems(updated)
  }

  function handleAddItem() {
    if (items.length >= 7) return setError('Maximum 7 items for table layout.')
    setError('')
    setItems([...items, { name: `Item ${items.length + 1}`, weight: 2, value: 3 }])
  }

  function handleRemoveItem(index) {
    if (items.length <= 1) return setError('Must have at least 1 item.')
    setError('')
    setItems(items.filter((_, i) => i !== index))
  }

  function handleRun() {
    if (capacity < 1 || capacity > 12) return setError('Capacity must be between 1 and 12.')
    setError('')
    setIsPlaying(false)
    setSteps(knapsack(items, capacity))
    setCurrentStep(0)
    setIsPlaying(true) // Automatically start playback!
  }

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
        You have a bag with a weight limit of <strong>{capacity}</strong> and a set of items,
        each with a weight and a value. Which items do you pack to <strong>maximise total value</strong>?
      </p>

      {/* ── Editable items table ── */}
      <div style={styles.editorCard}>
        <div style={styles.editorHeader}>
          <span style={styles.editorTitle}>Customize Items & Capacity</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={styles.capLabel}>Max Capacity:</label>
            <input
              type="number"
              min={1}
              max={12}
              value={capacity}
              onChange={e => setCapacity(Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1)))}
              style={styles.capInput}
            />
          </div>
        </div>

        <div style={styles.itemsList}>
          {items.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <input
                type="text"
                value={item.name}
                onChange={e => handleItemChange(i, 'name', e.target.value)}
                placeholder="Name"
                style={{ ...styles.itemInput, flex: 2 }}
              />
              <div style={styles.numInputGroup}>
                <span style={styles.inputPrefix}>w:</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={item.weight}
                  onChange={e => handleItemChange(i, 'weight', e.target.value)}
                  style={{ ...styles.itemInput, width: 54 }}
                />
              </div>
              <div style={styles.numInputGroup}>
                <span style={styles.inputPrefix}>v:</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={item.value}
                  onChange={e => handleItemChange(i, 'value', e.target.value)}
                  style={{ ...styles.itemInput, width: 54 }}
                />
              </div>
              <button style={styles.removeBtn} onClick={() => handleRemoveItem(i)} title="Remove item">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={styles.editorFooter}>
          <button style={styles.addBtn} onClick={handleAddItem}>
            + Add Item
          </button>
          <button style={styles.runBtn} onClick={handleRun} id="knapsack-run-btn">
            Run Knapsack ▶
          </button>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
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

      <PseudocodePanel algorithmId="knapsack" />
      <CodeTabs algorithmId="knapsack" />
    </div>
  )
}

const styles = {
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-green)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  editorCard: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 20 },
  editorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  editorTitle: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)' },
  capLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  capInput: { width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 13 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 },
  itemRow: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  itemInput: { padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: 13 },
  numInputGroup: { display: 'flex', alignItems: 'center', gap: 4 },
  inputPrefix: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  removeBtn: { width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--marker-red)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  editorFooter: { display: 'flex', justifyContent: 'space-between', gap: 10 },
  addBtn: { padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  runBtn: { padding: '7px 18px', borderRadius: 6, border: 'none', background: 'var(--marker-blue)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  errorText: { margin: '10px 0 0', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--marker-red)' },
  decisionBadge: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', width: 'fit-content' },
  decisionLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  decisionValue: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'capitalize' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflowX: 'auto' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
