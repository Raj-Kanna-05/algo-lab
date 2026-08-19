/**
 * MazeGrid — Responsive, Mobile-Friendly Maze Renderer
 *
 * Cells auto-scale using CSS aspect-ratio / flex-basis so the entire
 * grid fits perfectly on any screen size (mobile, tablet, desktop)
 * without awkward horizontal scrolling.
 */

const CELL_CONFIG = {
  empty:    { bg: 'var(--cell-empty)', border: 'rgba(255,255,255,0.05)', text: '' },
  wall:     { bg: '#080b10',           border: '#080b10',              text: '' },
  start:    { bg: 'var(--marker-blue)',  border: 'var(--marker-blue)',  text: 'S' },
  end:      { bg: 'var(--marker-green)', border: 'var(--marker-green)', text: 'E' },
  frontier: { bg: 'var(--marker-amber)', border: 'var(--marker-amber)', text: '' },
  visited:  { bg: 'var(--tint-blue)',    border: 'rgba(88,166,255,0.2)', text: '' },
  path:     { bg: 'var(--marker-green)', border: 'var(--marker-green)', text: '' },
}

export default function MazeGrid({ step }) {
  const { grid } = step
  const cols = grid[0].length

  return (
    <div style={styles.outerWrap}>
      <div
        style={{
          ...styles.gridContainer,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cellType, c) => {
            const cfg = CELL_CONFIG[cellType] ?? CELL_CONFIG.empty
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  ...styles.cell,
                  backgroundColor: cfg.bg,
                  borderColor: cfg.border,
                }}
              >
                {cfg.text && (
                  <span style={styles.badgeText}>{cfg.text}</span>
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
  outerWrap: {
    width: '100%',
    maxWidth: 680,
    margin: '0 auto',
    padding: '16px 12px',
    display: 'flex',
    justifyContent: 'center',
  },
  gridContainer: {
    display: 'grid',
    width: '100%',
    gap: 2,
    background: 'var(--surface-2)',
    padding: 8,
    borderRadius: 10,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  cell: {
    aspectRatio: '1 / 1',
    width: '100%',
    borderRadius: 3,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 140ms ease, border-color 140ms ease',
  },
  badgeText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'clamp(10px, 2.5vw, 15px)',
    color: '#ffffff',
    lineHeight: 1,
  },
}
