import { Link } from 'react-router-dom'

export default function ComingSoonPage() {
  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', marginBottom: 10 }}>
        NOT BUILT YET
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 16 }}>
        This visualization is on the way.
      </h1>
      <Link to="/" style={{ fontFamily: 'var(--font-mono)', color: 'var(--marker-blue)' }}>
        ← Back to all algorithms
      </Link>
    </div>
  )
}
