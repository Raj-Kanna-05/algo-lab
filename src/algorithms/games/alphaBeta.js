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
 *   phase     — 'explore' | 'prune' | 'score' | 'choose'
 *   alpha     — current alpha value
 *   beta      — current beta value
 *   score     — score of this node (if known)
 *   note      — plain-English explanation
 *   aiMove    — final chosen move (last step only)
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

export function alphaBeta(inputBoard) {
  const steps = []
  const board = inputBoard.slice()
  let pruneCount = 0

  function snap(board, note, highlight = null, phase = 'explore', score = null, alpha = -Infinity, beta = Infinity) {
    steps.push({
      board: board.slice(),
      highlight,
      phase,
      score,
      alpha: alpha === -Infinity ? '-∞' : alpha,
      beta:  beta  ===  Infinity ? '+∞' : beta,
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
    snap(board, `Trying X in square ${idx + 1}. α=${alpha === -Infinity ? '-∞' : alpha}, β=+∞`, idx, 'explore', null, alpha, beta)

    const score = abHelper(board, false, 1, alpha, beta)

    snap(board, `Square ${idx + 1} scores ${score}. α=${alpha === -Infinity ? '-∞' : alpha}`, idx, 'score', score, alpha, beta)

    board[idx] = null

    if (score > bestScore) {
      bestScore = score
      bestMove  = idx
      alpha = Math.max(alpha, score)
    }
  }

  snap(board, `AI chooses square ${bestMove + 1} (score=${bestScore}). Pruned ${pruneCount} branch(es) — faster than pure Minimax!`, bestMove, 'choose', bestScore, alpha, Infinity)

  const finalBoard = board.slice()
  finalBoard[bestMove] = 'X'
  steps[steps.length - 1] = { ...steps[steps.length - 1], board: finalBoard, aiMove: bestMove }

  return steps

  function abHelper(board, isMaximizing, depth, alpha, beta) {
    const winner = checkWinner(board)
    if (winner === 'X')    return 10 - depth
    if (winner === 'O')    return depth - 10
    if (winner === 'draw') return 0

    const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null)

    if (isMaximizing) {
      let value = -Infinity
      for (const i of empties) {
        board[i] = 'X'
        value = Math.max(value, abHelper(board, false, depth + 1, alpha, beta))
        board[i] = null
        alpha = Math.max(alpha, value)
        if (alpha >= beta) {
          pruneCount++
          break // β-cutoff — prune!
        }
      }
      return value
    } else {
      let value = Infinity
      for (const i of empties) {
        board[i] = 'O'
        value = Math.min(value, abHelper(board, true, depth + 1, alpha, beta))
        board[i] = null
        beta = Math.min(beta, value)
        if (alpha >= beta) {
          pruneCount++
          break // α-cutoff — prune!
        }
      }
      return value
    }
  }
}

export function createDefaultBoard() {
  return ['X', null, null, null, 'O', null, null, null, null]
}
