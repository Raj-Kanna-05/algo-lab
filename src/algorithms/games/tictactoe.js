/**
 * tictactoe.js — Shared Tic-Tac-Toe game logic
 *
 * Used by both MinimaxPage and AlphaBetaPage for the interactive Play mode.
 * The step-generation logic (for Learn mode) stays in minimax.js / alphaBeta.js.
 */

export const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],          // diagonals
]

/**
 * Returns: 'X' | 'O' | 'draw' | null (game still going)
 */
export function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.includes(null) ? null : 'draw'
}

/**
 * Minimax — returns the best move index for `aiSymbol`.
 * X is always the maximiser; O is always the minimiser.
 */
export function minimaxBestMove(board, aiSymbol = 'X') {
  const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)
  if (empties.length === 0) return null

  const isMaximising = aiSymbol === 'X'
  let best = isMaximising ? -Infinity : Infinity
  let bestMove = empties[0]

  for (const i of empties) {
    const b = board.slice()
    b[i] = aiSymbol
    const score = _minimax(b, !isMaximising, 1)
    if (isMaximising ? score > best : score < best) {
      best = score
      bestMove = i
    }
  }
  return bestMove
}

function _minimax(board, isMaximising, depth) {
  const w = checkWinner(board)
  if (w === 'X')    return 10 - depth
  if (w === 'O')    return depth - 10
  if (w === 'draw') return 0

  const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

  if (isMaximising) {
    let best = -Infinity
    for (const i of empties) {
      const b = board.slice(); b[i] = 'X'
      best = Math.max(best, _minimax(b, false, depth + 1))
    }
    return best
  } else {
    let best = Infinity
    for (const i of empties) {
      const b = board.slice(); b[i] = 'O'
      best = Math.min(best, _minimax(b, true, depth + 1))
    }
    return best
  }
}

/**
 * Alpha-Beta — same result as minimaxBestMove but faster (prunes branches).
 */
export function alphaBetaBestMove(board, aiSymbol = 'X') {
  const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)
  if (empties.length === 0) return null

  const isMaximising = aiSymbol === 'X'
  let best = isMaximising ? -Infinity : Infinity
  let bestMove = empties[0]
  let alpha = -Infinity, beta = Infinity

  for (const i of empties) {
    const b = board.slice()
    b[i] = aiSymbol
    const score = _alphaBeta(b, !isMaximising, 1, alpha, beta)
    if (isMaximising ? score > best : score < best) {
      best = score
      bestMove = i
    }
    if (isMaximising) alpha = Math.max(alpha, best)
    else               beta  = Math.min(beta,  best)
  }
  return bestMove
}

function _alphaBeta(board, isMaximising, depth, alpha, beta) {
  const w = checkWinner(board)
  if (w === 'X')    return 10 - depth
  if (w === 'O')    return depth - 10
  if (w === 'draw') return 0

  const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

  if (isMaximising) {
    let value = -Infinity
    for (const i of empties) {
      const b = board.slice(); b[i] = 'X'
      value = Math.max(value, _alphaBeta(b, false, depth + 1, alpha, beta))
      alpha = Math.max(alpha, value)
      if (alpha >= beta) break
    }
    return value
  } else {
    let value = Infinity
    for (const i of empties) {
      const b = board.slice(); b[i] = 'O'
      value = Math.min(value, _alphaBeta(b, true, depth + 1, alpha, beta))
      beta = Math.min(beta, value)
      if (alpha >= beta) break
    }
    return value
  }
}
