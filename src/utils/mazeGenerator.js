/**
 * mazeGenerator.js — Recursive backtracking maze generator
 *
 * Generates a random, solvable maze every time it's called.
 * Output grid format matches the existing BFS/A* cell types:
 *   'empty' | 'wall' | 'start' | 'end'
 *
 * How it works:
 *  - Start with a full grid of walls.
 *  - Treat cells at ODD (row, col) positions as "rooms".
 *  - Randomly carve passages between rooms, removing the
 *    wall cell between them.
 *  - Because we visit every room exactly once, every room
 *    is reachable → guaranteed solvable.
 */

export function generateMaze(rows = 11, cols = 15) {
  // Ensure odd dimensions so the room/wall alternation works
  const R = rows  % 2 === 0 ? rows  + 1 : rows
  const C = cols  % 2 === 0 ? cols  + 1 : cols

  // Start: all walls
  const grid = Array.from({ length: R }, () => Array(C).fill('wall'))

  // Fisher-Yates shuffle helper
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Carve rooms recursively from (r, c)
  function carve(r, c) {
    grid[r][c] = 'empty'

    // Four cardinal directions, each 2 cells away (to the next room)
    const dirs = shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]])

    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      // Check bounds (stay inside wall border) and unvisited
      if (nr > 0 && nr < R - 1 && nc > 0 && nc < C - 1 && grid[nr][nc] === 'wall') {
        // Remove the wall between current room and next room
        grid[r + dr / 2][c + dc / 2] = 'empty'
        carve(nr, nc)
      }
    }
  }

  // Start carving from the top-left room (1,1)
  carve(1, 1)

  // Place start and end markers
  grid[1][1]       = 'start'
  grid[R - 2][C - 2] = 'end'

  return grid
}
