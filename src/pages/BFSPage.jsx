import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { bfs } from '../algorithms/pathfinding/bfs'
import { generateMaze } from '../utils/mazeGenerator'
import MazeGrid from '../components/pathfinding/MazeGrid'
import PlaybackControls from '../components/common/PlaybackControls'

export default function BFSPage() {
  const [maze, setMaze]               = useState(() => generateMaze(11, 15))
  const [steps, setSteps]             = useState(() => bfs(maze))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(400)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  function handleNewMaze() {
    setIsPlaying(false)
    const newMaze = generateMaze(11, 15)
    setMaze(newMaze)
    setSteps(bfs(newMaze))
    setCurrentStep(0)
  }

  const step = steps[currentStep]

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.headerRow}>
        <div>
          <div style={styles.eyebrow}>PATHFINDING</div>
          <h1 style={styles.h1}>Breadth-First Search</h1>
        </div>
        <button style={styles.newMazeBtn} onClick={handleNewMaze}>
          New Maze 🎲
        </button>
      </div>

      <p style={styles.description}>
        BFS explores a maze outward from the start, one "layer" at a time — first
        all cells one step away, then all cells two steps away, and so on. It
        always finds the shortest path in an unweighted maze, but it explores
        in every direction equally, even away from the goal.
      </p>

      <div style={styles.legend}>
        <LegendItem color="var(--marker-blue)"  label="Start (S)" />
        <LegendItem color="var(--marker-green)" label="Goal (E)" />
        <LegendItem color="var(--marker-amber)" label="Frontier (being explored)" />
        <LegendItem color="var(--tint-blue)"    label="Visited" />
        <LegendItem color="var(--marker-green)" label="Shortest path" />
      </div>

      <div style={styles.panel}>
        <MazeGrid step={step} />
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
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 14 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-green)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: 0 },
  newMazeBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 13,
  },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  legend: { display: 'flex', gap: 18, marginBottom: 16, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: '50%', border: '1px solid var(--border)' },
  legendLabel: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, display: 'flex', justifyContent: 'center' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
