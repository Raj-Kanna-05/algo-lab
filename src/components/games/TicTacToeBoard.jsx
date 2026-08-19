/**
 * TicTacToeBoard — dark mode compatible, uses CSS variable tints
 *
 * step.board     — 9-item array: null | 'X' | 'O'
 * step.highlight — index of cell being focused (amber)
 * step.phase     — 'explore' | 'prune' | 'score' | 'choose'
 * step.aiMove    — final chosen move index (green)
 */

export default function TicTacToeBoard({ step }) {
  const { board, highlight, phase, aiMove } = step

  return (
    <div style={styles.wrap}>
      {board.map((cell, i) => {
        let bg          = 'var(--surface-2)'
        let borderColor = 'var(--border)'
        let glow        = 'none'

        if (aiMove === i) {
          bg          = 'var(--tint-green)'
          borderColor = 'var(--marker-green)'
          glow        = '0 0 0 3px rgba(63,185,80,0.35)'
        } else if (highlight === i) {
          if (phase === 'conflict' || phase === 'prune') {
            bg          = 'var(--tint-red)'
            borderColor = 'var(--marker-red)'
            glow        = '0 0 0 3px rgba(248,81,73,0.3)'
          } else {
            bg          = 'var(--tint-amber)'
            borderColor = 'var(--marker-amber)'
            glow        = '0 0 0 3px rgba(227,179,65,0.3)'
          }
        }

        return (
          <div
            key={i}
            style={{
              ...styles.cell,
              backgroundColor: bg,
              borderColor,
              boxShadow: glow,
            }}
          >
            <span style={{
              ...styles.mark,
              color: cell === 'X' ? 'var(--marker-blue)' : 'var(--marker-red)',
            }}>
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
    gridTemplateColumns: 'repeat(3, 96px)',
    gridTemplateRows:    'repeat(3, 96px)',
    gap: 8,
    padding: 20,
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid',
    borderRadius: 12,
    transition: 'background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
  },
  mark: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 38,
    lineHeight: 1,
    transition: 'color 120ms ease',
  },
}
