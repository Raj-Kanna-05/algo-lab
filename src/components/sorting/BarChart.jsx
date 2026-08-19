/**
 * BarChart — shared sorting visualizer
 *
 * Expects step.bars = Array<{ value: number, color: 'blue'|'amber'|'red'|'green' }>
 * Used by BubbleSort, MergeSort, and QuickSort pages.
 */

const COLOR_MAP = {
  blue:  'var(--marker-blue)',
  amber: 'var(--marker-amber)',
  red:   'var(--marker-red)',
  green: 'var(--marker-green)',
}

export default function BarChart({ step, maxValue }) {
  const { bars } = step

  return (
    <div style={styles.wrap}>
      {bars.map(({ value, color }, i) => (
        <div key={i} style={styles.barCol}>
          <div
            style={{
              ...styles.bar,
              height: `${(value / maxValue) * 100}%`,
              backgroundColor: COLOR_MAP[color] ?? COLOR_MAP.blue,
            }}
          />
          <span style={styles.label}>{value}</span>
        </div>
      ))}
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    height: 260,
    padding: '20px 20px 0 20px',
  },
  barCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 220ms ease, background-color 160ms ease',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-soft)',
    marginTop: 6,
  },
}
