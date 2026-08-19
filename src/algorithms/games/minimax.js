/**
 * minimax.js — Minimax on a Tic-Tac-Toe board
 *
 * Minimax is a decision-making algorithm used in two-player games.
 * The AI (X) tries to MAXIMIZE its score; the opponent (O) tries to MINIMIZE it.
 * It looks ahead at every possible future game state and picks the best move.
 *
 * Each step records:
 *   board      — 9-cell array (null | 'X' | 'O')
 *   highlight  — index of the cell being evaluated right now
 *   phase      — 'explore' | 'score' | 'choose'
 *   score      — the minimax score of this position (shown when known)
 *   note       — plain-English description
 *   aiMove     — index of the move the AI will make (only on final step)
 *   depth      — how deep in the tree we are (for display)
 */

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],          // diagonals
]

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.includes(null) ? null : 'draw'
}

export function minimax(inputBoard) {
  const steps = []
  const board = inputBoard.slice()

  function snap(board, note, highlight = null, phase = 'explore', score = null, depth = 0) {
    steps.push({
      board: board.slice(),
      highlight,
      phase,
      score,
      note,
      depth,
    })
  }

  snap(board, "AI (X) is thinking — it will explore every possible future move.", null, 'explore')

  let bestScore = -Infinity
  let bestMove  = null

  const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

  for (const idx of emptyIndices) {
    board[idx] = 'X'
    snap(board, `Trying move: X plays in square ${idx + 1}. Now evaluating the future…`, idx, 'explore', null, 1)

    const score = minimaxHelper(board, false, 1)

    snap(board, `If X plays square ${idx + 1}: minimax score = ${score}.`, idx, 'score', score, 1)

    board[idx] = null

    if (score > bestScore) {
      bestScore = score
      bestMove  = idx
    }
  }

  // Show the best move
  snap(board, `AI chooses square ${bestMove + 1} — highest score (${bestScore}). This is the optimal move!`, bestMove, 'choose', bestScore, 0)

  // Apply the move for the final frame
  const finalBoard = board.slice()
  finalBoard[bestMove] = 'X'
  steps[steps.length - 1] = {
    ...steps[steps.length - 1],
    board: finalBoard,
    aiMove: bestMove,
  }

  return steps

  // ---- internal recursive minimax (not recorded at every depth for brevity) ----
  function minimaxHelper(board, isMaximizing, depth) {
    const winner = checkWinner(board)
    if (winner === 'X')    return 10 - depth
    if (winner === 'O')    return depth - 10
    if (winner === 'draw') return 0

    const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

    if (isMaximizing) {
      let best = -Infinity
      for (const i of empties) {
        board[i] = 'X'
        best = Math.max(best, minimaxHelper(board, false, depth + 1))
        board[i] = null
      }
      return best
    } else {
      let best = Infinity
      for (const i of empties) {
        board[i] = 'O'
        best = Math.min(best, minimaxHelper(board, true, depth + 1))
        board[i] = null
      }
      return best
    }
  }
}

/** Default starting board — partially filled so the tree isn't enormous */
export function createDefaultBoard() {
  // O has played center, X has played top-left.  AI picks next X.
  return ['X', null, null, null, 'O', null, null, null, null]
}
