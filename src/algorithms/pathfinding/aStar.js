/**
 * aStar.js — A* Search on a 2D grid maze
 *
 * A* is smarter than BFS: instead of exploring in all directions equally,
 * it uses a "heuristic" (an estimate of how far away the goal is) to
 * explore the most promising paths first.
 *
 * Heuristic used: Manhattan distance = |rowDiff| + |colDiff|
 *
 * Cell visual states (same as BFS):
 *   'empty'    — unvisited walkable
 *   'wall'     — impassable
 *   'start'    — start
 *   'end'      — goal
 *   'frontier' — in the open set, currently under consideration (amber)
 *   'visited'  — already fully explored / closed (blue tint)
 *   'path'     — shortest path (green)
 */

export function aStar(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const steps = []

  let start = null, end = null
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'start') start = [r, c]
      if (grid[r][c] === 'end')   end   = [r, c]
    }
  }

  const cellState = grid.map(row => row.slice())

  function snap(note) {
    steps.push({ grid: cellState.map(row => row.slice()), note })
  }

  // Manhattan distance heuristic
  const h = ([r, c]) => Math.abs(r - end[0]) + Math.abs(c - end[1])
  const key = ([r, c]) => `${r},${c}`

  const gScore = {} // cost from start to each cell
  const fScore = {} // gScore + heuristic (total estimated cost)
  const parent = {}
  const openSet = new Set()
  const closedSet = new Set()

  const startKey = key(start)
  gScore[startKey] = 0
  fScore[startKey] = h(start)
  openSet.add(startKey)

  snap('Starting A* — it explores the most promising path first using distance estimates.')

  const directions = [[-1,0],[1,0],[0,-1],[0,1]]

  let found = false

  while (openSet.size > 0 && !found) {
    // Pick the open-set cell with the lowest fScore
    let current = null
    let bestF = Infinity
    for (const k of openSet) {
      if ((fScore[k] ?? Infinity) < bestF) {
        bestF = fScore[k]
        current = k
      }
    }

    const [cr, cc] = current.split(',').map(Number)

    if (current === key(end)) {
      found = true
      snap('Found the goal! Tracing back the shortest path…')
      break
    }

    openSet.delete(current)
    closedSet.add(current)
    if (grid[cr][cc] !== 'start') cellState[cr][cc] = 'visited'

    for (const [dr, dc] of directions) {
      const nr = cr + dr
      const nc = cc + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (grid[nr][nc] === 'wall') continue

      const nKey = key([nr, nc])
      if (closedSet.has(nKey)) continue

      const tentativeG = (gScore[current] ?? Infinity) + 1

      if (tentativeG < (gScore[nKey] ?? Infinity)) {
        parent[nKey] = current
        gScore[nKey] = tentativeG
        fScore[nKey] = tentativeG + h([nr, nc])

        if (!openSet.has(nKey)) {
          openSet.add(nKey)
          if (grid[nr][nc] !== 'end') cellState[nr][nc] = 'frontier'
          snap(
            `Added (${nr},${nc}) to open set. Estimated total cost: g=${tentativeG} + h=${h([nr,nc])} = f=${fScore[nKey]}.`
          )
        }
      }
    }
  }

  if (found) {
    const path = []
    let cur = key(end)
    while (cur && cur !== key(start)) {
      path.unshift(cur)
      cur = parent[cur]
    }
    for (const p of path) {
      const [r, c] = p.split(',').map(Number)
      if (grid[r][c] !== 'end') cellState[r][c] = 'path'
      snap(`Path: (${r},${c})`)
    }
    snap('A* complete! Green shows the optimal path — A* found it faster than BFS by steering toward the goal.')
  } else {
    snap('A* complete — no path found.')
  }

  return steps
}

// Same default maze as BFS — lets you compare them side-by-side
export function createDefaultMaze() {
  return [
    ['start','empty','empty','wall', 'empty','empty','empty'],
    ['wall', 'wall', 'empty','wall', 'empty','wall', 'empty'],
    ['empty','empty','empty','empty','empty','wall', 'empty'],
    ['empty','wall', 'wall', 'wall', 'empty','wall', 'end'  ],
    ['empty','empty','empty','empty','empty','empty','empty'],
  ]
}
