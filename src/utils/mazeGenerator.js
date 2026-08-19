/**
 * mazeGenerator.js — Advanced Maze Generator
 *
 * Generates complex, challenging mazes with multiple decoy paths,
 * loops, and dead-ends so pathfinding algorithms (BFS & A*)
 * visually demonstrate true exploration.
 */

export function generateMaze(rows = 15, cols = 21) {
  // Ensure odd dimensions so room/wall grid aligns cleanly
  const R = rows % 2 === 0 ? rows + 1 : rows
  const C = cols % 2 === 0 ? cols + 1 : cols

  const grid = Array.from({ length: R }, () => Array(C).fill('wall'))

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Recursive carving with bias for longer corridors
  function carve(r, c) {
    grid[r][c] = 'empty'
    const dirs = shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]])

    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr > 0 && nr < R - 1 && nc > 0 && nc < C - 1 && grid[nr][nc] === 'wall') {
        grid[r + dr / 2][c + dc / 2] = 'empty'
        carve(nr, nc)
      }
    }
  }

  // Start carving from (1, 1)
  carve(1, 1)

  // Add extra passages (braiding) to create loops & alternative routes
  // This makes the maze much more interesting than a simple tree-maze!
  const loopCount = Math.floor((R * C) / 35)
  let added = 0
  for (let attempt = 0; attempt < 200 && added < loopCount; attempt++) {
    const r = 1 + Math.floor(Math.random() * (R - 2))
    const c = 1 + Math.floor(Math.random() * (C - 2))
    if (grid[r][c] === 'wall') {
      // Check if removing this wall connects two empty passages
      const emptyNeighbors = [
        grid[r - 1]?.[c] === 'empty',
        grid[r + 1]?.[c] === 'empty',
        grid[r]?.[c - 1] === 'empty',
        grid[r]?.[c + 1] === 'empty',
      ].filter(Boolean).length

      if (emptyNeighbors >= 2) {
        grid[r][c] = 'empty'
        added++
      }
    }
  }

  // Place start at top-left, end at bottom-right
  grid[1][1] = 'start'
  grid[R - 2][C - 2] = 'end'

  // Ensure start and end cell surroundings are clear
  if (grid[1][2] === 'wall' && grid[2][1] === 'wall') grid[1][2] = 'empty'
  if (grid[R - 2][C - 3] === 'wall' && grid[R - 3][C - 2] === 'wall') grid[R - 2][C - 3] = 'empty'

  return grid
}
