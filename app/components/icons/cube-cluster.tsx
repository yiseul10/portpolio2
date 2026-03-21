export function CubeCluster({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 160 120"
    >
      {/* Top cube */}
      <path d="M80 20 L100 30 L100 50 L80 60 L60 50 L60 30 Z" />
      <path d="M80 60 L80 40 L100 30 M60 30 L80 40" />
      {/* Bottom-left cube */}
      <path d="M40 80 L60 90 L60 110 L40 120 L20 110 L20 90 Z" />
      <path d="M40 120 L40 100 L60 90 M20 90 L40 100" />
      {/* Bottom-center cube */}
      <path d="M80 80 L100 90 L100 110 L80 120 L60 110 L60 90 Z" />
      <path d="M80 120 L80 100 L100 90 M60 90 L80 100" />
      {/* Bottom-right cube */}
      <path d="M120 80 L140 90 L140 110 L120 120 L100 110 L100 90 Z" />
      <path d="M120 120 L120 100 L140 90 M100 90 L120 100" />
      {/* Dashed connecting lines */}
      <line x1="80" x2="40" y1="60" y2="80" strokeDasharray="2 2" />
      <line x1="80" x2="80" y1="60" y2="80" strokeDasharray="2 2" />
      <line x1="80" x2="120" y1="60" y2="80" strokeDasharray="2 2" />
    </svg>
  )
}
