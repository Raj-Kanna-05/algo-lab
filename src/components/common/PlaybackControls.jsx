import { useEffect, useRef } from 'react'

export default function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speedMs,
  onStepChange,
  onPlayingChange,
  onSpeedChange,
}) {
  const intervalRef = useRef(null)
  const atStart = currentStep === 0
  const atEnd = currentStep >= totalSteps - 1

  useEffect(() => {
    if (isPlaying && !atEnd) {
      intervalRef.current = setInterval(() => {
        onStepChange((prev) => Math.min(prev + 1, totalSteps - 1))
      }, speedMs)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speedMs, totalSteps, atEnd, onStepChange])

  useEffect(() => {
    if (atEnd) onPlayingChange(false)
  }, [atEnd, onPlayingChange])

  return (
    <div style={styles.wrap}>
      <div style={styles.buttonRow}>
        <button
          style={{ ...styles.iconButton, opacity: atStart ? 0.4 : 1 }}
          onClick={() => onStepChange(0)}
          disabled={atStart}
          aria-label="Reset to start"
        >
          ⏮
        </button>
        <button
          style={{ ...styles.iconButton, opacity: atStart ? 0.4 : 1 }}
          onClick={() => onStepChange((s) => Math.max(s - 1, 0))}
          disabled={atStart}
          aria-label="Previous step"
        >
          ◀
        </button>
        <button
          style={{ ...styles.playButton, opacity: atEnd ? 0.5 : 1 }}
          onClick={() => onPlayingChange(!isPlaying)}
          disabled={atEnd}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          style={{ ...styles.iconButton, opacity: atEnd ? 0.4 : 1 }}
          onClick={() => onStepChange((s) => Math.min(s + 1, totalSteps - 1))}
          disabled={atEnd}
          aria-label="Next step"
        >
          ▶
        </button>
      </div>

      <div style={styles.speedRow}>
        <label htmlFor="speed" style={styles.speedLabel}>Speed</label>
        <input
          id="speed"
          type="range"
          min={100}
          max={1200}
          step={100}
          value={1300 - speedMs}
          onChange={(e) => onSpeedChange(1300 - Number(e.target.value))}
          style={styles.slider}
        />
      </div>

      <div style={styles.stepCounter}>
        Step {currentStep + 1} / {totalSteps}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
    padding: '14px 18px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
  },
  buttonRow: { display: 'flex', gap: 8 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: 'var(--ink)',
    cursor: 'pointer',
    fontSize: 14,
  },
  playButton: {
    minWidth: 84,
    height: 38,
    borderRadius: 8,
    border: 'none',
    background: 'var(--marker-blue)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  speedRow: { display: 'flex', alignItems: 'center', gap: 8 },
  speedLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-soft)',
  },
  slider: { width: 120 },
  stepCounter: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-soft)',
  },
}
