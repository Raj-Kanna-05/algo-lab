/**
 * MazeGrid — uses CSS variables so it respects the dark theme
 */

const CELL_CONFIG = {
  empty:    { bg: 'var(--cell-empty)', border: 'var(--border)',        text: '' },
  wall:     { bg: '#0a0d12',           border: '#0a0d12',              text: '' },
  start:    { bg: 'var(--marker-blue)',  border: 'var(--marker-blue)',  text: 'S' },
  end:      { bg: 'var(--marker-green)', border: 'var(--marker-green)', text: 'E' },
  frontier: { bg: 'var(--marker-amber)', border: 'var(--marker-amber)', text: '' },
  visited:  { bg: 'var(--tint-blue)',    border: 'var(--border)',        text: '' },
  path:     { bg: 'var(--marker-green)', border: 'var(--marker-green)', text: '' },
}

export default function MazeGrid({ step, cellSize = 46 }) {
  const { grid } = step

  return (
    <div style={{ padding: 20 }}>
      {grid.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cellType, c) => {
            const cfg = CELL_CONFIG[cellType] ?? CELL_CONFIG.empty
            return (
              <div
                key={c}
                style={{
                  width:  cellSize,
                  height: cellSize,
                  backgroundColor: cfg.bg,
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: 5,
                  margin: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 180ms ease',
                }}
              >
                {cfg.text && (
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: Math.round(cellSize * 0.3),
                    color: '#fff',
                  }}>
                    {cfg.text}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
