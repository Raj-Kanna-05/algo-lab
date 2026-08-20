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
 *   phase      — 'explore' | 'score' | 'choose' | 'win' | 'draw'
 *   score      — the minimax score of this position (shown when known)
 *   note       — plain-English description
 *   aiMove     — index of the move the AI will make (only on 'choose' step)
 *   depth      — how deep in the tree we are (for display)
 *   player     — whose turn it is ('X' | 'O')
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

// ---- shared internal recursive minimax (not recorded) ----
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

/**
 * minimaxFullGame — Agent vs Agent full game.
 * Both X (maximiser) and O (minimiser) use Minimax for every move.
 * Steps capture the top-level exploration for each player's turn.
 */
export function minimaxFullGame() {
  const steps = []
  const board = Array(9).fill(null)
  let currentPlayer = 'X'

  function snap(b, note, highlight = null, phase = 'explore', score = null, depth = 0) {
    steps.push({ board: b.slice(), highlight, phase, score, note, depth, player: currentPlayer })
  }

  snap(board, 'Game start — X (maximiser ↑) vs O (minimiser ↓). Both agents use Minimax. X moves first.', null, 'explore', null, 0)

  while (true) {
    const winner = checkWinner(board)
    if (winner === 'X' || winner === 'O') {
      const last = steps[steps.length - 1]
      steps.push({ ...last, note: `${winner} wins! The losing agent had no better move — Minimax played perfectly.`, phase: 'win' })
      break
    }
    if (winner === 'draw') {
      const last = steps[steps.length - 1]
      steps.push({ ...last, note: 'Draw! With perfect play from both sides, Minimax proves Tic-Tac-Toe always ends in a draw.', phase: 'score' })
      break
    }

    const isMaximizing = currentPlayer === 'X'
    const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

    snap(board,
      `${currentPlayer} (${isMaximizing ? 'maximiser ↑' : 'minimiser ↓'}) is thinking — evaluating ${emptyIndices.length} possible move${emptyIndices.length !== 1 ? 's' : ''}…`,
      null, 'explore', null, 0
    )

    let bestScore = isMaximizing ? -Infinity : Infinity
    let bestMove  = null

    for (const idx of emptyIndices) {
      board[idx] = currentPlayer
      const score = minimaxHelper(board, !isMaximizing, 1)
      snap(board, `${currentPlayer} tries square ${idx + 1} → score: ${score}`, idx, 'score', score, 1)
      board[idx] = null

      if (isMaximizing ? score > bestScore : score < bestScore) {
        bestScore = score
        bestMove  = idx
      }
    }

    // Apply the chosen move
    board[bestMove] = currentPlayer
    steps.push({
      board: board.slice(),
      highlight: null,
      aiMove: bestMove,
      phase: 'choose',
      score: bestScore,
      note: `${currentPlayer} plays square ${bestMove + 1} (best score: ${bestScore}). Board updated.`,
      depth: 0,
      player: currentPlayer,
    })

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
  }

  return steps
}

/** Legacy single-turn minimax (kept for reference) */
export function minimax(inputBoard) {
  const steps = []
  const board = inputBoard.slice()

  function snap(board, note, highlight = null, phase = 'explore', score = null, depth = 0) {
    steps.push({ board: board.slice(), highlight, phase, score, note, depth, player: 'X' })
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

  snap(board, `AI chooses square ${bestMove + 1} — highest score (${bestScore}). This is the optimal move!`, bestMove, 'choose', bestScore, 0)

  const finalBoard = board.slice()
  finalBoard[bestMove] = 'X'
  steps[steps.length - 1] = { ...steps[steps.length - 1], board: finalBoard, aiMove: bestMove }

  return steps
}

/** Default starting board — fully empty so the tree shows complete exploration */
export function createDefaultBoard() {
  return [null, null, null, null, null, null, null, null, null]
}
