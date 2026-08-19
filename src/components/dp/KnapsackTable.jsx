/**
 * KnapsackTable — 2D DP table visualizer for the Knapsack problem
 *
 * Renders the full dp table (items+1 rows × capacity+1 columns).
 * Highlights the currently active cell based on step.row / step.col.
 *
 * step.table    — 2D array of dp values
 * step.row      — active item row (1-indexed)
 * step.col      — active capacity column
 * step.decision — 'skip' | 'take' | 'compare' | 'solution' | null
 * step.items    — original item list
 * step.selected — Set of selected item indices (final step)
 */

const DECISION_COLORS = {
  compare:  { bg: '#fffbee', border: 'var(--marker-amber)' },
  skip:     { bg: '#f0f4ff', border: 'var(--marker-blue)'  },
  take:     { bg: '#e6faf3', border: 'var(--marker-green)' },
  solution: { bg: 'var(--marker-green)', border: 'var(--marker-green)' },
}

export default function KnapsackTable({ step }) {
  const { table, row, col, decision, items, capacity, selected } = step
  const n = items.length

  return (
    <div style={styles.wrap}>
      <div style={styles.scrollArea}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Item \ Cap</th>
              {Array.from({ length: capacity + 1 }, (_, w) => (
                <th key={w} style={styles.th}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((tableRow, i) => (
              <tr key={i}>
                <td style={styles.rowLabel}>
                  {i === 0 ? '∅ (none)' : `${i}. ${items[i - 1].name} (w=${items[i-1].weight},v=${items[i-1].value})`}
                </td>
                {tableRow.map((val, w) => {
                  const isActive = i === row && w === col
                  const isSelected = decision === 'solution' && selected && i > 0 && selected.has(i - 1) && w === capacity
                  const cellStyle = isActive && DECISION_COLORS[decision]
                    ? { backgroundColor: DECISION_COLORS[decision].bg, borderColor: DECISION_COLORS[decision].border, fontWeight: 700 }
                    : isSelected
                      ? { backgroundColor: '#b8ddc9', fontWeight: 700 }
                      : {}

                  return (
                    <td key={w} style={{ ...styles.td, ...cellStyle }}>
                      {val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  wrap: { padding: '20px 20px 8px' },
  scrollArea: { overflowX: 'auto' },
  table: {
    borderCollapse: 'collapse',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
  th: {
    padding: '6px 10px',
    background: '#f0f1f4',
    border: '1px solid var(--border)',
    fontWeight: 600,
    textAlign: 'center',
    minWidth: 36,
  },
  rowLabel: {
    padding: '6px 12px',
    border: '1px solid var(--border)',
    background: '#f8f9fb',
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    whiteSpace: 'nowrap',
    color: 'var(--ink-soft)',
  },
  td: {
    padding: '6px 10px',
    border: '1px solid var(--border)',
    textAlign: 'center',
    minWidth: 36,
    transition: 'background-color 180ms ease, border-color 180ms ease',
  },
}
