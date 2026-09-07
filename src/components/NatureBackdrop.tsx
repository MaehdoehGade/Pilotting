/**
 * Abstract Swedish nature-meets-city skyline, built from flat geometric
 * shapes in the brand palette. No photography, no wildlife — just hills,
 * pine tree-lines, water and a minimal skyline silhouette.
 */
export function NatureBackdrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 430 220"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dccbd4" />
          <stop offset="100%" stopColor="#c8b2be" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56628a" />
          <stop offset="100%" stopColor="#3a486d" />
        </linearGradient>
      </defs>

      <rect width="430" height="220" fill="url(#sky)" />

      {/* sun / moon */}
      <circle cx="343" cy="52" r="26" fill="#f7f3ee" opacity="0.75" />

      {/* far hills */}
      <path d="M0 140 L60 108 L130 132 L210 100 L290 136 L360 112 L430 138 L430 220 L0 220 Z" fill="#8d81a3" opacity="0.55" />

      {/* city skyline, minimal */}
      <g fill="#3a486d" opacity="0.9">
        <rect x="24" y="118" width="16" height="46" />
        <rect x="44" y="98" width="20" height="66" />
        <rect x="68" y="126" width="14" height="38" />
        <polygon points="90,164 90,104 98,92 106,104 106,164" />
        <rect x="112" y="132" width="16" height="32" />
      </g>

      {/* water band */}
      <rect x="0" y="164" width="430" height="56" fill="url(#water)" />
      <g stroke="#dccbd4" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="182" x2="60" y2="182" />
        <line x1="140" y1="196" x2="190" y2="196" />
        <line x1="300" y1="184" x2="350" y2="184" />
      </g>

      {/* pine tree-line, right side */}
      <g fill="#202e17">
        {[300, 322, 344, 366, 388, 410].map((x, i) => {
          const h = i % 2 === 0 ? 58 : 44;
          return (
            <polygon
              key={x}
              points={`${x},${164 - h} ${x - 12},164 ${x + 12},164`}
            />
          );
        })}
      </g>
    </svg>
  );
}
