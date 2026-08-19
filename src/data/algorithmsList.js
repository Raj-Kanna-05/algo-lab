// Single source of truth for every algorithm in the app.
// Add a new algorithm here first, then build its page — Home page
// and routing both read from this list automatically.

export const CATEGORIES = {
  sorting:      { label: 'Sorting',               color: 'var(--marker-blue)'  },
  pathfinding:  { label: 'Pathfinding',            color: 'var(--marker-green)' },
  games:        { label: 'Game-Playing',           color: 'var(--marker-red)'   },
  trees:        { label: 'Trees',                  color: 'var(--marker-amber)' },
  backtracking: { label: 'Backtracking',           color: 'var(--marker-blue)'  },
  dp:           { label: 'Dynamic Programming',    color: 'var(--marker-green)' },
}

export const ALGORITHMS = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    blurb: 'Repeatedly swap neighbors that are out of order.',
    path: '/algorithm/bubble-sort',
    implemented: true,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    blurb: 'Split the array in half, sort each half, merge.',
    path: '/algorithm/merge-sort',
    implemented: true,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    blurb: 'Pick a pivot, partition around it, repeat.',
    path: '/algorithm/quick-sort',
    implemented: true,
  },
  {
    id: 'bfs-maze',
    name: 'Breadth-First Search',
    category: 'pathfinding',
    blurb: 'Explore a maze outward, layer by layer.',
    path: '/algorithm/bfs-maze',
    implemented: true,
  },
  {
    id: 'a-star-maze',
    name: 'A* Search',
    category: 'pathfinding',
    blurb: 'Explore a maze, but smartly head toward the goal.',
    path: '/algorithm/a-star-maze',
    implemented: true,
  },
  {
    id: 'minimax',
    name: 'Minimax',
    category: 'games',
    blurb: 'Look ahead at every possible move in Tic-Tac-Toe.',
    path: '/algorithm/minimax',
    implemented: true,
  },
  {
    id: 'alpha-beta',
    name: 'Alpha-Beta Pruning',
    category: 'games',
    blurb: 'Minimax, but skip branches that can\'t matter.',
    path: '/algorithm/alpha-beta',
    implemented: true,
  },
  {
    id: 'bst',
    name: 'Binary Search Tree',
    category: 'trees',
    blurb: 'Insert, search, and traverse nodes in order.',
    path: '/algorithm/bst',
    implemented: true,
  },
  {
    id: 'n-queens',
    name: 'N-Queens',
    category: 'backtracking',
    blurb: 'Place queens on a board, backtracking on conflicts.',
    path: '/algorithm/n-queens',
    implemented: true,
  },
  {
    id: 'knapsack',
    name: 'Knapsack Problem',
    category: 'dp',
    blurb: 'Fill a table to find the best combination of items.',
    path: '/algorithm/knapsack',
    implemented: true,
  },
]
