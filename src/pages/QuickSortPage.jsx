import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { quickSort } from '../algorithms/sorting/quickSort'
import BarChart from '../components/sorting/BarChart'
import PlaybackControls from '../components/common/PlaybackControls'
import ArrayInput from '../components/common/ArrayInput'

const DEFAULT_ARRAY = [8, 3, 7, 4, 9, 1, 6, 2, 5]

export default function QuickSortPage() {
  const [array, setArray]             = useState(DEFAULT_ARRAY)
  const [steps, setSteps]             = useState(() => quickSort(DEFAULT_ARRAY))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(600)

  const maxValue = Math.max(...array)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  function handleCustomArray(newArr) {
    setIsPlaying(false)
    setArray(newArr)
    setSteps(quickSort(newArr))
    setCurrentStep(0)
  }

  const step = steps[currentStep]

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.eyebrow}>SORTING</div>
      <h1 style={styles.h1}>Quick Sort</h1>

      <p style={styles.description}>
        Quick sort picks a "pivot" element, then rearranges the array so everything
        smaller goes left and everything larger goes right. It then recursively
        sorts each side. On average it runs in O(n log n) — and it sorts in-place,
        using less memory than merge sort.
      </p>

      <ArrayInput label="Custom Array" defaultValue={array} onRun={handleCustomArray} />

      <div style={styles.legend}>
        <LegendItem color="var(--marker-blue)"  label="Untouched" />
        <LegendItem color="var(--marker-amber)" label="Pivot" />
        <LegendItem color="var(--marker-red)"   label="Comparing / Swapping" />
        <LegendItem color="var(--marker-green)" label="Pivot placed correctly" />
      </div>

      <div style={styles.panel}>
        <BarChart step={step} maxValue={maxValue} />
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

function LegendItem({ color, label }) {
  return (
    <div style={styles.legendItem}>
      <span style={{ ...styles.legendDot, backgroundColor: color }} />
      <span style={styles.legendLabel}>{label}</span>
    </div>
  )
}

const styles = {
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-blue)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  legend: { display: 'flex', gap: 18, marginBottom: 16, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: '50%' },
  legendLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16 },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
