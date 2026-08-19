/**
 * TreeDiagram — Binary Search Tree visualizer (Dark mode compatible)
 *
 * Renders a BST as a tree diagram using SVG lines for edges
 * and SVG circles/text for nodes.
 *
 * step.tree — root node of the tree (with .left, .right, .value, .state, .id)
 * Node states: 'normal' | 'active' | 'found' | 'inserted' | 'deleted'
 */

const STATE_STYLES = {
  normal:   { bg: 'var(--surface-2)',       border: 'var(--border)',        text: 'var(--ink)' },
  active:   { bg: 'var(--tint-amber)',     border: 'var(--marker-amber)',  text: 'var(--ink)' },
  found:    { bg: 'var(--tint-green)',     border: 'var(--marker-green)',  text: 'var(--ink)' },
  inserted: { bg: 'var(--marker-green)',  border: 'var(--marker-green)',  text: '#ffffff'     },
  deleted:  { bg: 'var(--tint-red)',       border: 'var(--marker-red)',    text: 'var(--ink)' },
}

const NODE_RADIUS = 24
const V_SPACING = 70

function layoutTree(root) {
  const inOrder = []
  function inorder(node, depth) {
    if (!node) return
    inorder(node.left,  depth + 1)
    inOrder.push({ node, depth })
    inorder(node.right, depth + 1)
  }
  inorder(root, 0)

  const coords = {}
  inOrder.forEach(({ node, depth }, idx) => {
    coords[node.id] = { x: idx * (NODE_RADIUS * 2 + 20), y: depth * V_SPACING }
  })

  const edges = []
  function buildEdges(node) {
    if (!node) return
    if (node.left) {
      edges.push({ x1: coords[node.id].x, y1: coords[node.id].y, x2: coords[node.left.id].x, y2: coords[node.left.id].y })
      buildEdges(node.left)
    }
    if (node.right) {
      edges.push({ x1: coords[node.id].x, y1: coords[node.id].y, x2: coords[node.right.id].x, y2: coords[node.right.id].y })
      buildEdges(node.right)
    }
  }
  buildEdges(root)

  return { coords, inOrder, edges }
}

export default function TreeDiagram({ step }) {
  const { tree } = step
  if (!tree) return <div style={{ padding: 32, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Tree is empty.</div>

  const { coords, inOrder, edges } = layoutTree(tree)

  const xs = Object.values(coords).map(c => c.x)
  const ys = Object.values(coords).map(c => c.y)
  const minX = Math.min(...xs) - NODE_RADIUS - 10
  const maxX = Math.max(...xs) + NODE_RADIUS + 10
  const maxY = Math.max(...ys) + NODE_RADIUS + 10
  const width  = maxX - minX
  const height = maxY + 30
  const offsetX = -minX

  return (
    <div style={styles.wrap}>
      <svg
        width={width + 20}
        height={height}
        style={{ overflow: 'visible' }}
      >
        {/* Edges */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1 + offsetX}
            y1={e.y1 + NODE_RADIUS}
            x2={e.x2 + offsetX}
            y2={e.y2 + NODE_RADIUS}
            stroke="var(--border)"
            strokeWidth={2}
          />
        ))}

        {/* Nodes */}
        {inOrder.map(({ node }) => {
          const { x, y } = coords[node.id]
          const style = STATE_STYLES[node.state] ?? STATE_STYLES.normal
          return (
            <g key={node.id}>
              <circle
                cx={x + offsetX}
                cy={y + NODE_RADIUS}
                r={NODE_RADIUS}
                fill={style.bg}
                stroke={style.border}
                strokeWidth={2}
                style={{ transition: 'fill 200ms ease, stroke 200ms ease' }}
              />
              <text
                x={x + offsetX}
                y={y + NODE_RADIUS + 5}
                textAnchor="middle"
                fill={style.text}
                fontFamily="var(--font-display)"
                fontWeight="700"
                fontSize={15}
                style={{ transition: 'fill 200ms ease' }}
              >
                {node.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const styles = {
  wrap: {
    padding: '24px 24px 12px',
    overflowX: 'auto',
    minHeight: 200,
  },
}
