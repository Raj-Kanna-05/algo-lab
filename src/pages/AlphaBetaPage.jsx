import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { alphaBetaFullGame } from '../algorithms/games/alphaBeta'
import { alphaBetaBestMove } from '../algorithms/games/tictactoe'
import TicTacToeBoard from '../components/games/TicTacToeBoard'
import TicTacToeGame from '../components/games/TicTacToeGame'
import PlaybackControls from '../components/common/PlaybackControls'
import PseudocodePanel from '../components/common/PseudocodePanel'
import CodeTabs from '../components/common/CodeTabs'

export default function AlphaBetaPage() {
  const [mode, setMode]            = useState('learn') // 'learn' | 'play'
  const steps                      = useMemo(() => alphaBetaFullGame(), [])

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speedMs, setSpeedMs]         = useState(700)

  const handleStepChange = useCallback((updater) => {
    setCurrentStep((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const step = steps[currentStep]

  // Per-step player colour
  const playerColor = step.player === 'X' ? 'var(--marker-blue)' : 'var(--marker-red)'
  const roleLabel   = step.player === 'X' ? 'Maximiser ↑' : 'Minimiser ↓'

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/" style={styles.backLink}>← All algorithms</Link>

      <div style={styles.eyebrow}>GAME-PLAYING</div>
      <h1 style={styles.h1}>Alpha-Beta Pruning</h1>

      <p style={styles.description}>
        Alpha-Beta is Minimax with a powerful optimisation: if we already know
        a branch can't possibly be better than our current best, we <strong>prune</strong> it.
        In <strong>Learn Mode</strong>, both X and O play a full game — each using Alpha-Beta
        to pick every move. Watch α and β update as branches get cut.
      </p>

      {/* ── Mode selector ── */}
      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === 'learn' ? 'active' : ''}`}
          onClick={() => setMode('learn')}
          id="alphabeta-mode-learn"
        >
          📖 Learn Mode (Agent vs Agent)
        </button>
        <button
          className={`mode-tab ${mode === 'play' ? 'active' : ''}`}
          onClick={() => setMode('play')}
          id="alphabeta-mode-play"
        >
          🎮 Play Mode (You vs AI)
        </button>
      </div>

      {mode === 'learn' ? (
        <>
          <div style={styles.info}>
            <InfoBadge label="Current player" value={step.player ?? '—'}      color={playerColor} />
            <InfoBadge label="Role"           value={roleLabel}                color={playerColor} />
            <InfoBadge label="α (best for X)" value={String(step.alpha ?? '-∞')} color="var(--marker-blue)" />
            <InfoBadge label="β (best for O)" value={String(step.beta  ?? '+∞')} color="var(--marker-red)" />
            <InfoBadge label="Phase"          value={step.phase}               color="var(--marker-amber)" />
            {step.score !== null && step.score !== undefined && (
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

      <PseudocodePanel algorithmId="alpha-beta" />
      <CodeTabs algorithmId="alpha-beta" />
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
