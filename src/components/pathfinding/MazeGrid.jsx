/**
 * MazeGrid — shared visual for BFS and A* pages
 *
 * Renders a 2D grid where each cell has a visual state:
 *   'empty'    → plain white
 *   'wall'     → dark filled square
 *   'start'    → blue S
 *   'end'      → green E
 *   'frontier' → amber (being explored)
 *   'visited'  → soft blue tint (already explored)
 *   'path'     → bright green (shortest path)
 */

const CELL_COLORS = {
  empty:    { bg: '#f8f9fb', border: '#dde1e8', text: '' },
  wall:     { bg: '#1b1f27', border: '#1b1f27', text: '' },
  start:    { bg: 'var(--marker-blue)', border: 'var(--marker-blue)', text: 'S' },
  end:      { bg: 'var(--marker-green)', border: 'var(--marker-green)', text: 'E' },
  frontier: { bg: 'var(--marker-amber)', border: 'var(--marker-amber)', text: '' },
  visited:  { bg: '#d4e2ff', border: '#a9c0ff', text: '' },
  path:     { bg: 'var(--marker-green)', border: 'var(--marker-green)', text: '' },
}

export default function MazeGrid({ step }) {
  const { grid } = step

  return (
    <div style={styles.wrap}>
      {grid.map((row, r) => (
        <div key={r} style={styles.row}>
          {row.map((cellType, c) => {
            const colors = CELL_COLORS[cellType] ?? CELL_COLORS.empty
            return (
              <div
                key={c}
                style={{
                  ...styles.cell,
                  backgroundColor: colors.bg,
                  border: `1.5px solid ${colors.border}`,
                }}
              >
                {colors.text && (
                  <span style={styles.cellLabel}>{colors.text}</span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

const CELL_SIZE = 52

const styles = {
  wrap: {
    display: 'inline-block',
    padding: 20,
  },
  row: {
    display: 'flex',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    margin: 2,
    transition: 'background-color 200ms ease',
  },
  cellLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 15,
    color: '#fff',
  },
}
