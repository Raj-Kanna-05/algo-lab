# Algo Lab

An interactive visualizer that shows how classic algorithms work,
step by step: sorting, pathfinding, game-playing (Minimax/Alpha-Beta),
trees, backtracking, and dynamic programming.

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (any recent version).

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in, click "Add New Project",
   and select the repository.
3. Vercel auto-detects Vite — leave all settings as default and click Deploy.
4. You'll get a live link like `algo-lab.vercel.app` that updates automatically
   every time you push new code to GitHub.

## How the project is organized

```
src/
├── algorithms/     the "brains" — pure logic, no visuals.
│                   each algorithm returns a list of step-by-step
│                   snapshots for the UI to play back.
├── components/
│   ├── common/     shared across every algorithm (playback controls, cards)
│   └── sorting/    visuals specific to sorting (bar chart)
│       pathfinding/, games/, trees/, backtracking/, dp/  (add as you build them)
├── data/
│   └── algorithmsList.js   the master list of all 10 algorithms — the
│                            Home page and routes are generated from this
├── pages/          one file per algorithm screen
└── App.jsx         routing
```

## The pattern: Bubble Sort is the template

Bubble Sort (`src/algorithms/sorting/bubbleSort.js` +
`src/pages/BubbleSortPage.jsx` + `src/components/sorting/BarChart.jsx`)
is fully built and working. It's meant to be copied for every other
algorithm:

1. **Write the algorithm logic** in `src/algorithms/<category>/yourAlgo.js`.
   It should take an input and return an array of "step" objects — a
   snapshot of the state at each moment, plus a short plain-English `note`.
   It should know nothing about colors, animation, or React.

2. **Build (or reuse) a visual component** in `src/components/<category>/`
   that takes one step and renders it (e.g. a grid for mazes, a tree
   diagram for BST, a table for Knapsack).

3. **Create the page** in `src/pages/`, following `BubbleSortPage.jsx`:
   run the algorithm once with `useMemo`, track `currentStep` with
   `useState`, and reuse `<PlaybackControls />` — you get Play/Pause/Step/
   Speed for free, no need to rebuild it.

4. **Register it** in `src/data/algorithmsList.js` (flip `implemented: true`)
   and add its route in `src/App.jsx`.

That's the whole loop — repeat it for Merge Sort, Quick Sort, BFS, A*,
Minimax, Alpha-Beta, BST, N-Queens, and Knapsack.

---

## Tech stack

| Layer | Tool | Why |
|---|---|---|
| UI framework | **React 18** | Component model, `useMemo`, `useState`, `useEffect` |
| Routing | **React Router v6** | `<Routes>` / `<Route>` — one route per algorithm page |
| Build tool | **Vite 5** | Near-instant HMR, native ESM, zero config |
| Styling | **Vanilla CSS** (CSS custom properties) | No runtime, no class naming, full control |
| Fonts | **Space Grotesk** · **Inter** · **JetBrains Mono** | Loaded from Google Fonts |
| Deployment | **Vercel** | Auto-deploy on every `git push` to `main` |

No UI library, no state manager, no CSS framework — intentionally lean so
the algorithm logic stays front and centre.

---

## Architecture

The app is built around one central idea: **separate the algorithm from the
animation**. Every algorithm is a pure function that runs once and returns a
list of "steps". React just plays those steps back like a video.

```
┌─────────────────────────────────────────────────────────────────┐
│  src/algorithms/<category>/<algo>.js                            │
│  Pure JS function — no React, no DOM.                           │
│  Input → array of step snapshots                                │
└────────────────────┬────────────────────────────────────────────┘
                     │  steps[]  (computed once with useMemo)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/pages/<AlgoName>Page.jsx                                   │
│  Owns currentStep (useState).                                   │
│  Passes one step down to the visual component.                  │
│  Passes step controls down to <PlaybackControls />.             │
└──────────┬──────────────────────────────┬───────────────────────┘
           │  step                        │  currentStep / callbacks
           ▼                              ▼
┌─────────────────────┐      ┌────────────────────────────────────┐
│  Visual component   │      │  <PlaybackControls />              │
│  BarChart / MazeGrid│      │  Play · Pause · Step · Speed       │
│  TreeDiagram / etc. │      │  Uses setInterval internally.      │
└─────────────────────┘      └────────────────────────────────────┘
```

### Step object format

Each algorithm defines its own step shape, but always includes a `note`
field (a plain-English sentence shown below the visualisation).

**Sorting** (Bubble Sort, Merge Sort, Quick Sort):
```js
{
  bars: [{ value: 8, color: 'blue' }, { value: 3, color: 'amber' }, …],
  note: 'Comparing positions 0 and 1.'
}
```
Colors: `blue` = untouched · `amber` = comparing · `red` = swapping ·
`green` = sorted.

**Pathfinding** (BFS, A\*): grid-based step with cell states
(unvisited / frontier / visited / path).

**Game-playing** (Minimax, Alpha-Beta): game-tree node states
(current / explored / pruned / best).

**Trees** (BST): node highlight states (active / visited / inserted).

**Backtracking** (N-Queens): board state with queen positions and
conflict markers.

**Dynamic Programming** (Knapsack): 2-D DP table with the current cell
being filled highlighted.

---

## Design system

All visual tokens are defined as CSS custom properties in
`src/index.css` and referenced everywhere — no hard-coded colors.

```css
/* Palette — "whiteboard lab" */
--bg:           #f4f5f7   /* light grid paper background */
--surface:      #ffffff   /* card / panel background     */
--ink:          #1b1f27   /* primary text                */
--ink-soft:     #5b6270   /* secondary / label text      */
--border:       #dde1e8   /* panel borders               */

/* Marker colors — used for algorithm highlights */
--marker-blue:  #2b59ff
--marker-amber: #ffb020
--marker-red:   #ff4136
--marker-green: #00b894

/* Typography */
--font-display: 'Space Grotesk'   /* headings */
--font-body:    'Inter'           /* body copy, buttons */
--font-mono:    'JetBrains Mono'  /* code, step counter, labels */
```

The body has a **28 px CSS grid-line background** to give it a graph-paper
/ whiteboard feel. Cards lift on hover via a `translateY(-2px)` transition.
`prefers-reduced-motion` is respected globally.

---

## Key components

### `<PlaybackControls />` — `src/components/common/PlaybackControls.jsx`

Reused by every algorithm page. It is **stateless about the algorithm** —
it only knows a `currentStep` number, a `totalSteps` count, and callbacks.
Internally it runs a `setInterval` (cleared on unmount / speed change) to
auto-advance steps when playing.

Props:
```
currentStep     number
totalSteps      number
isPlaying       boolean
speedMs         number   (100 – 1200 ms per step)
onStepChange    (updater) => void
onPlayingChange (bool) => void
onSpeedChange   (ms) => void
```

### `<AlgorithmCard />` — `src/components/common/AlgorithmCard.jsx`

The card grid on the Home page. Rendered from `ALGORITHMS` in
`algorithmsList.js` — adding a new algorithm to that list automatically
creates its card.

### `<BarChart />` — `src/components/sorting/BarChart.jsx`

SVG bar chart driven by a single sorting `step`. Bar heights are
proportional to value; colors come straight from `step.bars[i].color`.

### Visual components (one per algorithm category)

| Component | File | Used by |
|---|---|---|
| `BarChart` | `components/sorting/BarChart.jsx` | Bubble, Merge, Quick Sort |
| `MazeGrid` | `components/pathfinding/MazeGrid.jsx` | BFS, A\* |
| `TicTacToeBoard` | `components/games/TicTacToeBoard.jsx` | Minimax, Alpha-Beta |
| `TreeDiagram` | `components/trees/TreeDiagram.jsx` | BST |
| `QueensBoard` | `components/backtracking/QueensBoard.jsx` | N-Queens |
| `KnapsackTable` | `components/dp/KnapsackTable.jsx` | Knapsack |

---

## Algorithm catalogue

All 10 algorithms are **fully implemented and registered**.

| # | Algorithm | Category | Key file |
|---|---|---|---|
| 1 | Bubble Sort | Sorting | `algorithms/sorting/bubbleSort.js` |
| 2 | Merge Sort | Sorting | `algorithms/sorting/mergeSort.js` |
| 3 | Quick Sort | Sorting | `algorithms/sorting/quickSort.js` |
| 4 | BFS (maze) | Pathfinding | `algorithms/pathfinding/bfs.js` |
| 5 | A\* (maze) | Pathfinding | `algorithms/pathfinding/aStar.js` |
| 6 | Minimax | Game-Playing | `algorithms/games/minimax.js` |
| 7 | Alpha-Beta Pruning | Game-Playing | `algorithms/games/alphaBeta.js` |
| 8 | Binary Search Tree | Trees | `algorithms/trees/bst.js` |
| 9 | N-Queens | Backtracking | `algorithms/backtracking/nQueens.js` |
| 10 | 0/1 Knapsack | Dynamic Programming | `algorithms/dp/knapsack.js` |

Routes follow the pattern `/algorithm/<id>` where `id` comes from
`algorithmsList.js` (e.g. `/algorithm/bubble-sort`).

---

## Data flow for a single algorithm page

```
1. Module loads → algorithm function imported
2. Page mounts   → useMemo runs algorithm once → steps[] cached
3. User hits Play → isPlaying = true
4. PlaybackControls setInterval ticks → currentStep++
5. Page re-renders → passes steps[currentStep] to visual component
6. Visual component renders the snapshot → user sees the animation
7. User hits Pause or last step reached → isPlaying = false
```

No Redux, no context, no global store — state lives in the page component
and flows downward via props.

---

## Adding a new algorithm (checklist)

```
[ ] src/algorithms/<category>/<name>.js   — pure function, returns steps[]
[ ] src/components/<category>/<Visual>.jsx — renders one step
[ ] src/pages/<Name>Page.jsx              — copy BubbleSortPage.jsx template
[ ] src/data/algorithmsList.js            — add entry, set implemented: true
[ ] src/App.jsx                           — add <Route path=… element=… />
```
