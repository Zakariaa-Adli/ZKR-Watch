export function PageLoader({ rows = 6 }) {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label="Loading page">
      <div className="page-loader__header">
        <span className="skeleton skeleton--eyebrow" />
        <span className="skeleton skeleton--title" />
        <span className="skeleton skeleton--text" />
      </div>
      <div className="page-loader__grid">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="page-loader__card" key={index}>
            <span className="skeleton skeleton--poster" />
            <span className="skeleton skeleton--line" />
            <span className="skeleton skeleton--line-short" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
