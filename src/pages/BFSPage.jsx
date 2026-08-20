import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bfs } from '../algorithms/pathfinding/bfs'
import { generateMaze } from '../utils/mazeGenerator'
import MazeGrid from '../components/pathfinding/MazeGrid'
import PlaybackControls from '../components/common/PlaybackControls'
import PseudocodePanel from '../components/common/PseudocodePanel'
import CodeTabs from '../components/common/CodeTabs'

function getResponsiveDimensions() {
  if (typeof window !== 'undefined' && window.innerWidth < 600) {
    return [13, 15] // smaller grid for mobile phones
  }
  return [15, 21] // standard grid for tablet/desktop
}

export default function BFSPage() {
  const [dims, setDims]               = useState(getResponsiveDimensions)
  const [maze, setMaze]               = useState(() => generateMaze(dims[0], dims[1]))
  const [steps, setSteps]             = useState(() => bfs(maze))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(350)

  useEffect(() => {
    function handleResize() {
      const newDims = getResponsiveDimensions()
      if (newDims[0] !== dims[0] || newDims[1] !== dims[1]) {
        setDims(newDims)
        const newMaze = generateMaze(newDims[0], newDims[1])
        setMaze(newMaze)
        setSteps(bfs(newMaze))
        setCurrentStep(0)
        setIsPlaying(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dims])

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  function handleNewMaze() {
    setIsPlaying(false)
    const newMaze = generateMaze(dims[0], dims[1])
    setMaze(newMaze)
    setSteps(bfs(newMaze))
    setCurrentStep(0)
    setIsPlaying(true) // Automatically start playback!
  }

  const step = steps[currentStep]

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.headerRow}>
        <div>
          <div style={styles.eyebrow}>PATHFINDING</div>
          <h1 style={styles.h1}>Breadth-First Search</h1>
        </div>
        <button style={styles.newMazeBtn} onClick={handleNewMaze} id="bfs-new-maze">
          New Maze 🎲
        </button>
      </div>

      <p style={styles.description}>
        BFS explores outward layer by layer from the start (S). It guarantees the shortest path
        in an unweighted maze by visiting all 1-step neighbors, then 2-step neighbors, and so on.
      </p>

      <div style={styles.legend}>
        <LegendItem color="var(--marker-blue)"  label="Start (S)" />
        <LegendItem color="var(--marker-green)" label="Goal (E)" />
        <LegendItem color="var(--marker-amber)" label="Frontier" />
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

      <PseudocodePanel algorithmId="bfs-maze" />
      <CodeTabs algorithmId="bfs-maze" />
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
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 20 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-green)', marginBottom: 4 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 34px)', margin: 0 },
  newMazeBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  description: { fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 640, marginBottom: 16 },
  legend: { display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: '50%', border: '1px solid var(--border)' },
  legendLabel: { fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-soft)' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14, width: '100%', overflow: 'hidden' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)', minHeight: 20, marginBottom: 14 },
}
