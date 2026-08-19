/**
 * bfs.js — Breadth-First Search on a 2D grid maze
 *
 * The maze is a 2D array of cell types:
 *   'empty'  — walkable
 *   'wall'   — impassable
 *   'start'  — starting cell
 *   'end'    — goal cell
 *
 * Each step snapshot records the full grid of cells with their visual state:
 *   'empty'    — unvisited walkable cell
 *   'wall'     — wall
 *   'start'    — start marker
 *   'end'      — end marker
 *   'frontier' — currently being explored (amber)
 *   'visited'  — already explored (blue tint)
 *   'path'     — the shortest path (green), shown on the final step
 */

export function bfs(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const steps = []

  // Find start and end positions
  let start = null, end = null
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'start') start = [r, c]
      if (grid[r][c] === 'end')   end   = [r, c]
    }
  }

  // Visual state of every cell — starts as a copy of the grid
  const cellState = grid.map(row => row.slice())

  function snap(note) {
    steps.push({
      grid: cellState.map(row => row.slice()),
      note,
    })
  }

  snap('Starting BFS — we explore outward from the start, layer by layer.')

  const queue = [start]
  const visited = new Set()
  const parent = {} // key: "r,c" → parent key — lets us retrace the path
  const key = ([r, c]) => `${r},${c}`

  visited.add(key(start))

  const directions = [[-1,0],[1,0],[0,-1],[0,1]] // up, down, left, right

  let found = false

  while (queue.length > 0 && !found) {
    const current = queue.shift()
    const [cr, cc] = current

    for (const [dr, dc] of directions) {
      const nr = cr + dr
      const nc = cc + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue

      const cellType = grid[nr][nc]
      if (cellType === 'wall') continue

      const nKey = key([nr, nc])
      if (visited.has(nKey)) continue

      visited.add(nKey)
      parent[nKey] = key(current)

      if (cellType === 'end') {
        cellState[nr][nc] = 'frontier'
        snap(`Found the goal! Now retracing the shortest path.`)
        found = true
        break
      }

      cellState[nr][nc] = 'frontier'
      snap(`Exploring cell (${nr}, ${nc}) — added to the frontier.`)
      cellState[nr][nc] = 'visited'
      queue.push([nr, nc])
    }

    if (!found && cellState[cr][cc] !== 'start') {
      cellState[cr][cc] = 'visited'
    }
  }

  if (found) {
    // Retrace path from end back to start
    const path = []
    let cur = key(end)
    while (cur && cur !== key(start)) {
      path.unshift(cur)
      cur = parent[cur]
    }
    for (const p of path) {
      const [r, c] = p.split(',').map(Number)
      if (grid[r][c] !== 'end') cellState[r][c] = 'path'
      snap(`Tracing back the shortest path through (${r}, ${c}).`)
    }
    snap('BFS complete! The green cells show the shortest path from start to end.')
  } else {
    snap('BFS complete — no path exists from start to end.')
  }

  return steps
}

/**
 * Creates a default demo maze grid.
 * 'S' = start, 'E' = end, '#' = wall, '.' = empty
 */
export function createDefaultMaze() {
  const layout = [
    ['start','empty','empty','wall', 'empty','empty','empty'],
    ['wall', 'wall', 'empty','wall', 'empty','wall', 'empty'],
    ['empty','empty','empty','empty','empty','wall', 'empty'],
    ['empty','wall', 'wall', 'wall', 'empty','wall', 'end'  ],
    ['empty','empty','empty','empty','empty','empty','empty'],
  ]
  return layout
}
