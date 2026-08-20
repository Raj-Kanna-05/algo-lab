/**
 * alphaBeta.js — Alpha-Beta Pruning on a Tic-Tac-Toe board
 *
 * Alpha-Beta is Minimax with an optimization:
 * if we already know a branch can't possibly beat our current best,
 * we PRUNE it — skip it entirely and save time.
 *
 * Alpha = best score the MAXIMIZER (X) is guaranteed so far
 * Beta  = best score the MINIMIZER (O) is guaranteed so far
 * When alpha >= beta, we prune (stop exploring).
 *
 * Each step:
 *   board     — 9-cell array (null | 'X' | 'O')
 *   highlight — cell being evaluated
 *   phase     — 'explore' | 'prune' | 'score' | 'choose' | 'win'
 *   alpha     — current alpha value
 *   beta      — current beta value
 *   score     — score of this node (if known)
 *   note      — plain-English explanation
 *   aiMove    — final chosen move ('choose' step only)
 *   player    — whose turn it is ('X' | 'O')
 */

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.includes(null) ? null : 'draw'
}

// ---- shared internal alpha-beta helper (not recorded) ----
function abHelper(board, isMaximizing, depth, alpha, beta, pruneCountRef) {
  const winner = checkWinner(board)
  if (winner === 'X')    return 10 - depth
  if (winner === 'O')    return depth - 10
  if (winner === 'draw') return 0

  const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

  if (isMaximizing) {
    let value = -Infinity
    for (const i of empties) {
      board[i] = 'X'
      value = Math.max(value, abHelper(board, false, depth + 1, alpha, beta, pruneCountRef))
      board[i] = null
      alpha = Math.max(alpha, value)
      if (alpha >= beta) { pruneCountRef.count++; break }
    }
    return value
  } else {
    let value = Infinity
    for (const i of empties) {
      board[i] = 'O'
      value = Math.min(value, abHelper(board, true, depth + 1, alpha, beta, pruneCountRef))
      board[i] = null
      beta = Math.min(beta, value)
      if (alpha >= beta) { pruneCountRef.count++; break }
    }
    return value
  }
}

function fmtAlpha(a) { return a === -Infinity ? '-∞' : a }
function fmtBeta(b)  { return b ===  Infinity ? '+∞' : b }

/**
 * alphaBetaFullGame — Agent vs Agent full game using Alpha-Beta pruning.
 * Both X (maximiser) and O (minimiser) prune branches on every turn.
 */
export function alphaBetaFullGame() {
  const steps = []
  const board = Array(9).fill(null)
  let currentPlayer = 'X'
  let totalPrunes = 0

  function snap(b, note, highlight = null, phase = 'explore', score = null, alpha = -Infinity, beta = Infinity) {
    steps.push({
      board: b.slice(),
      highlight,
      phase,
      score,
      alpha: fmtAlpha(alpha),
      beta:  fmtBeta(beta),
      note,
      player: currentPlayer,
    })
  }

  snap(board, 'Game start — X (maximiser ↑) vs O (minimiser ↓). Both use Alpha-Beta pruning. X moves first.', null, 'explore')

  while (true) {
    const winner = checkWinner(board)
    if (winner === 'X' || winner === 'O') {
      const last = steps[steps.length - 1]
      steps.push({ ...last, note: `${winner} wins! Total branches pruned this game: ${totalPrunes}.`, phase: 'win' })
      break
    }
    if (winner === 'draw') {
      const last = steps[steps.length - 1]
      steps.push({ ...last, note: `Draw! Perfect play. Total branches pruned this game: ${totalPrunes}.`, phase: 'score' })
      break
    }

    const isMaximizing = currentPlayer === 'X'
    const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null)
    const pruneRef = { count: 0 }

    let alpha = -Infinity
    let beta  =  Infinity

    snap(board,
      `${currentPlayer} (${isMaximizing ? 'maximiser ↑' : 'minimiser ↓'}) is thinking with Alpha-Beta — evaluating ${emptyIndices.length} move${emptyIndices.length !== 1 ? 's' : ''}…`,
      null, 'explore', null, alpha, beta
    )

    let bestScore = isMaximizing ? -Infinity : Infinity
    let bestMove  = null

    for (const idx of emptyIndices) {
      board[idx] = currentPlayer
      snap(board, `${currentPlayer} tries square ${idx + 1}. α=${fmtAlpha(alpha)}, β=${fmtBeta(beta)}`, idx, 'explore', null, alpha, beta)

      const score = abHelper(board, !isMaximizing, 1, alpha, beta, pruneRef)
      snap(board, `Square ${idx + 1} → score: ${score}. α=${fmtAlpha(alpha)}, β=${fmtBeta(beta)}`, idx, 'score', score, alpha, beta)
      board[idx] = null

      if (isMaximizing ? score > bestScore : score < bestScore) {
        bestScore = score
        bestMove  = idx
      }
      if (isMaximizing) alpha = Math.max(alpha, bestScore)
      else              beta  = Math.min(beta,  bestScore)
    }

    totalPrunes += pruneRef.count
    // Apply chosen move
    board[bestMove] = currentPlayer
    steps.push({
      board: board.slice(),
      highlight: null,
      aiMove: bestMove,
      phase: 'choose',
      score: bestScore,
      alpha: fmtAlpha(alpha),
      beta:  fmtBeta(beta),
      note: `${currentPlayer} plays square ${bestMove + 1} (score: ${bestScore}). Pruned ${pruneRef.count} branch${pruneRef.count !== 1 ? 'es' : ''} this turn.`,
      player: currentPlayer,
    })

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
  }

  return steps
}

/** Legacy single-turn alpha-beta (kept for reference) */
export function alphaBeta(inputBoard) {
  const steps = []
  const board = inputBoard.slice()
  const pruneRef = { count: 0 }

  function snap(board, note, highlight = null, phase = 'explore', score = null, alpha = -Infinity, beta = Infinity) {
    steps.push({
      board: board.slice(),
      highlight,
      phase,
      score,
      alpha: fmtAlpha(alpha),
      beta:  fmtBeta(beta),
      note,
    })
  }

  snap(board, 'AI (X) uses Alpha-Beta pruning — like Minimax but skips hopeless branches.', null, 'explore')

  let bestScore = -Infinity
  let bestMove  = null
  let alpha = -Infinity
  const beta = Infinity

  const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

  for (const idx of emptyIndices) {
    board[idx] = 'X'
    snap(board, `Trying X in square ${idx + 1}. α=${fmtAlpha(alpha)}, β=+∞`, idx, 'explore', null, alpha, beta)

    const score = abHelper(board, false, 1, alpha, beta, pruneRef)

    snap(board, `Square ${idx + 1} scores ${score}. α=${fmtAlpha(alpha)}`, idx, 'score', score, alpha, beta)

    board[idx] = null

    if (score > bestScore) {
      bestScore = score
      bestMove  = idx
      alpha = Math.max(alpha, score)
    }
  }

  snap(board, `AI chooses square ${bestMove + 1} (score=${bestScore}). Pruned ${pruneRef.count} branch(es) — faster than pure Minimax!`, bestMove, 'choose', bestScore, alpha, Infinity)

  const finalBoard = board.slice()
  finalBoard[bestMove] = 'X'
  steps[steps.length - 1] = { ...steps[steps.length - 1], board: finalBoard, aiMove: bestMove }

  return steps
}

export function createDefaultBoard() {
  return [null, null, null, null, null, null, null, null, null]
}
