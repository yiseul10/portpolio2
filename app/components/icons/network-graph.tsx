export function NetworkGraph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 160 120"
    >
      <circle cx="30" cy="60" r="3" />
      <circle cx="60" cy="30" r="5" />
      <circle cx="70" cy="80" r="7" />
      <circle cx="110" cy="90" r="8" />
      <circle cx="140" cy="50" r="5" />
      <circle cx="120" cy="100" r="3" />
      <line x1="30" x2="60" y1="60" y2="30" />
      <line x1="60" x2="70" y1="30" y2="80" />
      <line x1="70" x2="110" y1="80" y2="90" />
      <line x1="110" x2="140" y1="90" y2="50" />
      <line x1="30" x2="70" y1="60" y2="80" />
      <line x1="60" x2="110" y1="30" y2="90" strokeDasharray="4 2" />
    </svg>
  )
}
