/**
 * TicTacToeGame — interactive Play mode for Minimax and Alpha-Beta pages
 *
 * Props:
 *   getBestMoveFn(board, aiSymbol) — either minimaxBestMove or alphaBetaBestMove
 *   algorithmLabel                 — "Minimax" or "Alpha-Beta" (shown in UI)
 *
 * Rules:
 *   - X always goes first (standard Tic-Tac-Toe)
 *   - Player picks symbol: X (first) or O (second)
 *   - When it's AI's turn, it responds after a 350ms delay to feel natural
 *   - AI plays optimally — best you can do is draw
 */
import { useState, useEffect } from 'react'
import { checkWinner, WIN_LINES } from '../../algorithms/games/tictactoe'

export default function TicTacToeGame({ getBestMoveFn, algorithmLabel = 'AI' }) {
  const [playerSymbol, setPlayerSymbol] = useState('X')
  const [board, setBoard]               = useState(Array(9).fill(null))
  const [currentTurn, setCurrentTurn]   = useState('X')
  const [result, setResult]             = useState(null)    // null | 'X' | 'O' | 'draw'
  const [winLine, setWinLine]           = useState(null)    // [a,b,c] indices
  const [aiThinking, setAiThinking]     = useState(false)

  const aiSymbol     = playerSymbol === 'X' ? 'O' : 'X'
  const isPlayerTurn = currentTurn === playerSymbol && !result

  // ── AI move effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentTurn !== aiSymbol || result) return

    setAiThinking(true)
    const snap = board.slice() // capture board at scheduling time

    const timer = setTimeout(() => {
      const move = getBestMoveFn(snap, aiSymbol)
      setAiThinking(false)

      if (move === null || move === undefined || snap[move] !== null) return

      const nb = snap.slice()
      nb[move] = aiSymbol
      setBoard(nb)

      const w = checkWinner(nb)
      if (w) {
        setResult(w)
        if (w !== 'draw') setWinLine(findWinLine(nb))
      } else {
        setCurrentTurn(aiSymbol === 'X' ? 'O' : 'X')
      }
    }, 350)

    return () => { clearTimeout(timer); setAiThinking(false) }
  // board is captured in snap; intentionally omit to avoid re-scheduling
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn, result])

  // ── Player click ────────────────────────────────────────────────────────────
  function handleCellClick(i) {
    if (!isPlayerTurn || board[i] || result) return

    const nb = board.slice()
    nb[i] = playerSymbol
    setBoard(nb)

    const w = checkWinner(nb)
    if (w) {
      setResult(w)
      if (w !== 'draw') setWinLine(findWinLine(nb))
    } else {
      setCurrentTurn(playerSymbol === 'X' ? 'O' : 'X')
    }
  }

  // ── Role change ─────────────────────────────────────────────────────────────
  function changeRole(sym) {
    setPlayerSymbol(sym)
    setBoard(Array(9).fill(null))
    setCurrentTurn('X')
    setResult(null)
    setWinLine(null)
    setAiThinking(false)
  }

  // ── New game ────────────────────────────────────────────────────────────────
  function newGame() {
    setBoard(Array(9).fill(null))
    setCurrentTurn('X')
    setResult(null)
    setWinLine(null)
    setAiThinking(false)
  }

  // ── Status message ──────────────────────────────────────────────────────────
  let statusText  = isPlayerTurn ? 'Your turn' : aiThinking ? `${algorithmLabel} is thinking…` : `${algorithmLabel} is thinking…`
  let statusColor = 'var(--ink-soft)'
  if (result) {
    if (result === 'draw')          { statusText = "It's a draw!"; statusColor = 'var(--marker-amber)' }
    else if (result === playerSymbol) { statusText = 'You win! 🎉';  statusColor = 'var(--marker-green)' }
    else                            { statusText = `${algorithmLabel} wins`; statusColor = 'var(--marker-red)' }
  }

  return (
    <div>
      {/* ── Role selector ── */}
      <div style={styles.roleRow}>
        <span style={styles.roleLabel}>Play as:</span>
        <button
          style={{ ...styles.roleBtn, ...(playerSymbol === 'X' ? styles.roleBtnActive : {}) }}
          onClick={() => changeRole('X')}
          id="play-as-x"
        >
          X&nbsp;<small>(first)</small>
        </button>
        <button
          style={{ ...styles.roleBtn, ...(playerSymbol === 'O' ? styles.roleBtnActive : {}) }}
          onClick={() => changeRole('O')}
          id="play-as-o"
        >
          O&nbsp;<small>(second)</small>
        </button>
      </div>

      {/* ── Status bar ── */}
      <div style={{ ...styles.status, color: statusColor }}>
        {statusText}
      </div>

      {/* ── Board ── */}
      <div style={styles.board}>
        {board.map((cell, i) => {
          const isWinCell = winLine && winLine.includes(i)
          let bg = 'var(--surface-2)'
          let border = 'var(--border)'

          if (isWinCell) {
            bg = result === playerSymbol ? 'var(--tint-green)' : 'var(--tint-red)'
            border = result === playerSymbol ? 'var(--marker-green)' : 'var(--marker-red)'
          } else if (!cell && isPlayerTurn && !result) {
            // hoverable
          }

          return (
            <div
              key={i}
              onClick={() => handleCellClick(i)}
              style={{
                ...styles.cell,
                backgroundColor: bg,
                borderColor: border,
                cursor: isPlayerTurn && !cell && !result ? 'pointer' : 'default',
              }}
              className={isPlayerTurn && !cell && !result ? 'ttt-cell-hover' : ''}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 38,
                color: cell === 'X' ? 'var(--marker-blue)' : 'var(--marker-red)',
                transition: 'color 120ms ease',
                lineHeight: 1,
              }}>
                {cell ?? ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── New game button ── */}
      <button style={styles.newGameBtn} onClick={newGame} id="new-game-btn">
        New Game
      </button>

      {/* ── Hover style (injected inline) ── */}
      <style>{`
        .ttt-cell-hover:hover {
          border-color: var(--marker-blue) !important;
          background-color: var(--tint-blue) !important;
        }
      `}</style>
    </div>
  )
}

function findWinLine(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a, b, c]
  }
  return null
}

const styles = {
  roleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  roleLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-soft)',
    marginRight: 4,
  },
  roleBtn: {
    padding: '7px 16px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 13,
    transition: 'all 130ms ease',
  },
  roleBtnActive: {
    background: 'var(--marker-blue)',
    borderColor: 'var(--marker-blue)',
    color: '#fff',
  },
  status: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 14,
    minHeight: 24,
    transition: 'color 200ms ease',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 96px)',
    gridTemplateRows:    'repeat(3, 96px)',
    gap: 8,
    marginBottom: 20,
    width: 'fit-content',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid',
    borderRadius: 12,
    transition: 'background-color 150ms ease, border-color 150ms ease',
  },
  newGameBtn: {
    padding: '9px 24px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 14,
    transition: 'background 130ms ease',
  },
}
