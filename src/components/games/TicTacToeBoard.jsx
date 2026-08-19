/**
 * TicTacToeBoard — shared visual for Minimax and Alpha-Beta pages
 *
 * Renders a Tic-Tac-Toe board (3×3 grid of cells).
 * Highlights the cell currently being evaluated.
 *
 * step.board     — 9-item array: null | 'X' | 'O'
 * step.highlight — index of cell being focused (amber glow)
 * step.phase     — 'explore' | 'prune' | 'score' | 'choose'
 * step.aiMove    — final chosen move index (green glow)
 */

export default function TicTacToeBoard({ step }) {
  const { board, highlight, phase, aiMove } = step

  return (
    <div style={styles.wrap}>
      {board.map((cell, i) => {
        let borderColor = 'var(--border)'
        let bgColor     = 'var(--surface)'
        let glowColor   = 'none'

        if (aiMove === i) {
          bgColor   = '#e6faf3'
          borderColor = 'var(--marker-green)'
          glowColor = '0 0 0 3px var(--marker-green)'
        } else if (highlight === i) {
          if (phase === 'conflict' || phase === 'prune') {
            bgColor   = '#fff0ee'
            borderColor = 'var(--marker-red)'
            glowColor = '0 0 0 3px var(--marker-red)'
          } else {
            bgColor   = '#fffbee'
            borderColor = 'var(--marker-amber)'
            glowColor = '0 0 0 3px var(--marker-amber)'
          }
        }

        return (
          <div
            key={i}
            style={{
              ...styles.cell,
              backgroundColor: bgColor,
              borderColor,
              boxShadow: glowColor,
            }}
          >
            <span
              style={{
                ...styles.mark,
                color: cell === 'X' ? 'var(--marker-blue)' : 'var(--marker-red)',
              }}
            >
              {cell ?? ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  wrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 100px)',
    gridTemplateRows:    'repeat(3, 100px)',
    gap: 8,
    padding: 20,
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid',
    borderRadius: 12,
    transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
  },
  mark: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 1,
    transition: 'color 150ms ease',
  },
}
