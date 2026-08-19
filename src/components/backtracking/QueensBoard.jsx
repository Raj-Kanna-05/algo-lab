/**
 * QueensBoard — uses CSS variables for dark mode compatibility
 */

export default function QueensBoard({ step }) {
  const { board, n, row: activeRow, col: activeCol, phase } = step

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, 52px)`,
          gridTemplateRows:    `repeat(${n}, 52px)`,
          border: '2px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
          width: 'fit-content',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            const isLight = (r + c) % 2 === 0
            let bg = isLight ? 'var(--chess-light)' : 'var(--chess-dark)'

            if (cell === 'queen') {
              bg = isLight
                ? 'rgba(63,185,80,0.25)'
                : 'rgba(63,185,80,0.15)'
            } else if (r === activeRow && c === activeCol) {
              if (phase === 'conflict' || phase === 'backtrack') {
                bg = 'var(--tint-red)'
              } else if (phase === 'try' || phase === 'place') {
                bg = 'var(--tint-amber)'
              }
            }

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 150ms ease',
                }}
              >
                {cell === 'queen' && (
                  <span style={{ fontSize: 26, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} role="img" aria-label="Queen">
                    ♛
                  </span>
                )}
                {r === activeRow && c === activeCol && cell !== 'queen' && (phase === 'try' || phase === 'place') && (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--marker-amber)', opacity: 0.8 }}>?</span>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
