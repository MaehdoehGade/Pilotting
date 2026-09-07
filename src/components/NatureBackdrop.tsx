/**
 * Abstract Swedish nature-meets-city skyline at night, built from flat
 * geometric shapes in the brand palette. No photography, no wildlife —
 * hills, a pine tree-line, water and a minimal lit skyline.
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
          <stop offset="0%" stopColor="#16211d" />
          <stop offset="100%" stopColor="#2a3a5a" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141d2b" />
          <stop offset="100%" stopColor="#0e1613" />
        </linearGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="#f2efe8" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#dccbd4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dccbd4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="430" height="220" fill="url(#sky)" />

      {/* stars, kept within the visible (bottom-aligned) slice of the viewBox */}
      <g fill="#f2efe8" opacity="0.5">
        {[
          [30, 72], [70, 90], [130, 68], [190, 84], [230, 74],
          [20, 100], [260, 88], [400, 78],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />
        ))}
      </g>

      {/* moon — soft ambient glow, deliberately not button-shaped, kept away
          from the real chest button in the top-right corner */}
      <circle cx="175" cy="98" r="46" fill="url(#moonGlow)" />
      <circle cx="175" cy="98" r="14" fill="#dccbd4" opacity="0.5" />

      {/* far hills */}
      <path
        d="M0 140 L60 108 L130 132 L210 100 L290 136 L360 112 L430 138 L430 220 L0 220 Z"
        fill="#3a486d"
        opacity="0.55"
      />

      {/* city skyline, minimal, with lit windows */}
      <g fill="#16211d">
        <rect x="24" y="118" width="16" height="46" />
        <rect x="44" y="98" width="20" height="66" />
        <rect x="68" y="126" width="14" height="38" />
        <polygon points="90,164 90,104 98,92 106,104 106,164" />
        <rect x="112" y="132" width="16" height="32" />
      </g>
      <g fill="#c8b2be" opacity="0.85">
        <rect x="29" y="126" width="3" height="3" />
        <rect x="35" y="140" width="3" height="3" />
        <rect x="50" y="108" width="3" height="3" />
        <rect x="50" y="122" width="3" height="3" />
        <rect x="57" y="136" width="3" height="3" />
        <rect x="73" y="134" width="3" height="3" />
        <rect x="117" y="140" width="3" height="3" />
      </g>

      {/* water band */}
      <rect x="0" y="164" width="430" height="56" fill="url(#water)" />
      <g stroke="#c8b2be" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="182" x2="60" y2="182" />
        <line x1="140" y1="196" x2="190" y2="196" />
        <line x1="300" y1="184" x2="350" y2="184" />
      </g>

      {/* pine tree-line, right side */}
      <g fill="#0e1613">
        {[300, 322, 344, 366, 388, 410].map((x, i) => {
          const h = i % 2 === 0 ? 58 : 44;
          return (
            <polygon key={x} points={`${x},${164 - h} ${x - 12},164 ${x + 12},164`} />
          );
        })}
      </g>
    </svg>
  );
}
