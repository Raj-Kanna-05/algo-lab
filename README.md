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
