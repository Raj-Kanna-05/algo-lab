/**
 * nQueens.js — N-Queens backtracking visualizer
 *
 * Places N queens on an N×N chessboard so that no two queens
 * attack each other (same row, column, or diagonal).
 *
 * Uses backtracking: try placing a queen, if it leads to a conflict
 * later, remove it and try the next column ("backtrack").
 *
 * Each step:
 *   board   — N×N array of cell states: 'empty' | 'queen' | 'conflict' | 'safe' | 'backtrack'
 *   row     — which row we're currently placing in
 *   col     — which column we tried
 *   phase   — 'place' | 'conflict' | 'backtrack' | 'solution'
 *   note    — plain-English description
 */

export function nQueens(n) {
  const steps = []
  const board = Array.from({ length: n }, () => Array(n).fill('empty'))

  function snap(row, col, phase, note) {
    steps.push({
      board: board.map(r => r.slice()),
      row,
      col,
      phase,
      note,
      n,
    })
  }

  snap(0, -1, 'start', `Starting N-Queens for N=${n}. We place queens row by row.`)

  function isSafe(row, col) {
    // Check column above
    for (let r = 0; r < row; r++) {
      if (board[r][col] === 'queen') return false
    }
    // Check upper-left diagonal
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
      if (board[r][c] === 'queen') return false
    }
    // Check upper-right diagonal
    for (let r = row - 1, c = col + 1; r >= 0 && c < n; r--, c++) {
      if (board[r][c] === 'queen') return false
    }
    return true
  }

  let solved = false

  function solve(row) {
    if (solved) return true
    if (row === n) {
      solved = true
      snap(row, -1, 'solution', `All ${n} queens placed! No two queens attack each other. ✓`)
      return true
    }

    for (let col = 0; col < n; col++) {
      snap(row, col, 'try', `Row ${row + 1}: trying column ${col + 1}…`)

      if (isSafe(row, col)) {
        board[row][col] = 'queen'
        snap(row, col, 'place', `Safe! Placing queen in row ${row + 1}, column ${col + 1}.`)

        if (solve(row + 1)) return true

        // Backtrack
        board[row][col] = 'empty'
        snap(row, col, 'backtrack', `Dead end — removing queen from row ${row + 1}, column ${col + 1}. Backtracking…`)
      } else {
        snap(row, col, 'conflict', `Conflict! A queen already attacks row ${row + 1}, column ${col + 1}. Skipping.`)
      }
    }

    return false
  }

  solve(0)

  if (!solved) {
    snap(0, -1, 'no-solution', `No solution exists for N=${n}.`)
  }

  return steps
}

export const DEFAULT_N = 6
