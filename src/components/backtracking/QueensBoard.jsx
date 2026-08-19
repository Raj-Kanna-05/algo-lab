/**
 * QueensBoard — N-Queens backtracking visualizer
 *
 * Renders an N×N chessboard. Cells can be:
 *   'empty'     → alternating light/dark (like a chessboard)
 *   'queen'     → queen placed here (crown emoji)
 *   'try'       → cell being tried right now (amber)
 *   'conflict'  → cell that conflicts with an existing queen (red tint)
 *   'backtrack' → cell being removed (red flash)
 *   'safe'      → safe cell (green tint)
 */

export default function QueensBoard({ step }) {
  const { board, n, row: activeRow, col: activeCol, phase } = step

  return (
    <div style={styles.outer}>
      <div
        style={{
          ...styles.board,
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gridTemplateRows:    `repeat(${n}, 1fr)`,
        }}
      >
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            const isLight = (r + c) % 2 === 0
            let bg = isLight ? '#f0ede6' : '#c8bfb0'
            let overlay = null

            if (cell === 'queen') {
              bg = isLight ? '#e2f5ec' : '#b8ddc9'
            } else if (r === activeRow && c === activeCol) {
              if (phase === 'conflict' || phase === 'backtrack') {
                bg = '#ffdfdc'
              } else if (phase === 'try' || phase === 'place') {
                bg = '#fff5d4'
              }
            }

            return (
              <div
                key={`${r}-${c}`}
                style={{ ...styles.cell, backgroundColor: bg }}
              >
                {cell === 'queen' && (
                  <span style={styles.queen} role="img" aria-label="Queen">♛</span>
                )}
                {r === activeRow && c === activeCol && cell !== 'queen' && (phase === 'try' || phase === 'place') && (
                  <span style={styles.tryMarker}>?</span>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const styles = {
  outer: { padding: 20 },
  board: {
    display: 'grid',
    width: 'fit-content',
    border: '2px solid var(--border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cell: {
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 160ms ease',
  },
  queen: {
    fontSize: 30,
    lineHeight: 1,
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
    transition: 'font-size 150ms ease',
  },
  tryMarker: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 20,
    color: 'var(--marker-amber)',
    opacity: 0.7,
  },
}
