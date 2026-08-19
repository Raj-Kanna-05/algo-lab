import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { alphaBeta, createDefaultBoard } from '../algorithms/games/alphaBeta'
import { alphaBetaBestMove } from '../algorithms/games/tictactoe'
import TicTacToeBoard from '../components/games/TicTacToeBoard'
import TicTacToeGame from '../components/games/TicTacToeGame'
import PlaybackControls from '../components/common/PlaybackControls'

export default function AlphaBetaPage() {
  const [mode, setMode]            = useState('learn') // 'learn' | 'play'
  const startBoard                 = useMemo(() => createDefaultBoard(), [])
  const steps                      = useMemo(() => alphaBeta(startBoard), [startBoard])

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

      <div style={styles.eyebrow}>GAME-PLAYING</div>
      <h1 style={styles.h1}>Alpha-Beta Pruning</h1>

      <p style={styles.description}>
        Alpha-Beta is Minimax with a powerful optimisation: if we already know
        a branch can't possibly be better than our current best, we <strong>prune</strong> it —
        skip it entirely. Alpha (α) tracks the best score the maximiser is guaranteed;
        Beta (β) tracks the best the minimiser is guaranteed. When α ≥ β, we cut off.
      </p>

      {/* ── Mode selector ── */}
      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === 'learn' ? 'active' : ''}`}
          onClick={() => setMode('learn')}
          id="alphabeta-mode-learn"
        >
          📖 Learn Mode (Step-by-step)
        </button>
        <button
          className={`mode-tab ${mode === 'play' ? 'active' : ''}`}
          onClick={() => setMode('play')}
          id="alphabeta-mode-play"
        >
          🎮 Play Mode (Interactive)
        </button>
      </div>

      {mode === 'learn' ? (
        <>
          <div style={styles.info}>
            <InfoBadge label="α (best for X)" value={String(step.alpha)} color="var(--marker-blue)" />
            <InfoBadge label="β (best for O)" value={String(step.beta)} color="var(--marker-red)" />
            <InfoBadge label="Phase" value={step.phase} color="var(--marker-amber)" />
            {step.score !== null && (
              <InfoBadge label="Score" value={String(step.score)} color="var(--marker-green)" />
            )}
          </div>

          <div style={styles.panel}>
            <TicTacToeBoard step={step} />
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
        </>
      ) : (
        <div style={styles.playPanel}>
          <TicTacToeGame getBestMoveFn={alphaBetaBestMove} algorithmLabel="Alpha-Beta AI" />
        </div>
      )}
    </div>
  )
}

function InfoBadge({ label, value, color }) {
  return (
    <div style={styles.badge}>
      <span style={styles.badgeLabel}>{label}</span>
      <span style={{ ...styles.badgeValue, color }}>{value}</span>
    </div>
  )
}

const styles = {
  backLink: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', display: 'inline-block', marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--marker-red)', marginBottom: 6 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 14px 0' },
  description: { fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 640, marginBottom: 20 },
  info: { display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  badge: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 2 },
  badgeLabel: { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-soft)', textTransform: 'uppercase' },
  badgeValue: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, display: 'inline-block' },
  playPanel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'inline-block' },
  note: { fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink)', minHeight: 20, marginBottom: 16 },
}
