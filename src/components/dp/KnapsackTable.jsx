/**
 * KnapsackTable — dark mode compatible, uses CSS variables
 */

const DECISION_STYLE = {
  compare:  { bg: 'var(--tint-amber)', border: 'var(--marker-amber)' },
  skip:     { bg: 'var(--tint-blue)',  border: 'var(--marker-blue)'  },
  take:     { bg: 'var(--tint-green)', border: 'var(--marker-green)' },
  solution: { bg: 'var(--tint-green)', border: 'var(--marker-green)' },
}

export default function KnapsackTable({ step }) {
  const { table, row, col, decision, items, capacity, selected } = step
  const n = items.length

  return (
    <div style={{ padding: '20px 20px 8px', overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
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
                {i === 0
                  ? '∅ (none)'
                  : `${i}. ${items[i-1].name} (w=${items[i-1].weight} v=${items[i-1].value})`}
              </td>
              {tableRow.map((val, w) => {
                const isActive = i === row && w === col
                const dStyle   = isActive && DECISION_STYLE[decision]
                const isSelectedPath = decision === 'solution' && selected && i > 0 && selected.has(i - 1) && w === capacity

                return (
                  <td
                    key={w}
                    style={{
                      ...styles.td,
                      ...(dStyle
                        ? { backgroundColor: dStyle.bg, borderColor: dStyle.border, fontWeight: 700, color: 'var(--ink)' }
                        : {}),
                      ...(isSelectedPath
                        ? { backgroundColor: 'var(--tint-green)', fontWeight: 700 }
                        : {}),
                    }}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  th: {
    padding: '6px 10px',
    background: 'var(--table-head)',
    border: '1px solid var(--border)',
    fontWeight: 600,
    textAlign: 'center',
    minWidth: 36,
    color: 'var(--ink-soft)',
  },
  rowLabel: {
    padding: '6px 12px',
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    whiteSpace: 'nowrap',
    color: 'var(--ink-soft)',
  },
  td: {
    padding: '6px 10px',
    border: '1px solid var(--border)',
    textAlign: 'center',
    minWidth: 36,
    color: 'var(--ink)',
    transition: 'background-color 180ms ease, border-color 180ms ease',
  },
}
