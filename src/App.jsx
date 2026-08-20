import { Routes, Route } from 'react-router-dom'
import ThemeToggle from './components/common/ThemeToggle'

// Pages
import Home          from './pages/Home'
import BubbleSortPage from './pages/BubbleSortPage'
import MergeSortPage  from './pages/MergeSortPage'
import QuickSortPage  from './pages/QuickSortPage'
import BFSPage        from './pages/BFSPage'
import AStarPage      from './pages/AStarPage'
import MinimaxPage    from './pages/MinimaxPage'
import AlphaBetaPage  from './pages/AlphaBetaPage'
import BSTPage        from './pages/BSTPage'
import NQueensPage    from './pages/NQueensPage'
import KnapsackPage   from './pages/KnapsackPage'
import ComingSoonPage  from './pages/ComingSoonPage'

export default function App() {
  return (
    <>
      {/* Fixed theme toggle — visible on every page */}
      <ThemeToggle />

      <Routes>
        <Route path="/"                          element={<Home />}          />
        <Route path="/algorithm/bubble-sort"     element={<BubbleSortPage />} />
        <Route path="/algorithm/merge-sort"      element={<MergeSortPage />}  />
        <Route path="/algorithm/quick-sort"      element={<QuickSortPage />}  />
        <Route path="/algorithm/bfs-maze"        element={<BFSPage />}        />
        <Route path="/algorithm/a-star-maze"     element={<AStarPage />}      />
        <Route path="/algorithm/minimax"         element={<MinimaxPage />}    />
        <Route path="/algorithm/alpha-beta"      element={<AlphaBetaPage />}  />
        <Route path="/algorithm/bst"             element={<BSTPage />}        />
        <Route path="/algorithm/n-queens"        element={<NQueensPage />}    />
        <Route path="/algorithm/knapsack"        element={<KnapsackPage />}   />
        {/* Fallback for any future algorithms before their pages are built */}
        <Route path="/algorithm/:id"             element={<ComingSoonPage />}  />
      </Routes>
    </>
  )
}
