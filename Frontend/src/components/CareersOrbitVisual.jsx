// Animated hero illustration for the Careers page: a central "Join our team"
// card with career-role chips orbiting it. Chips counter-rotate so their text
// stays upright. Motion classes come from fx.css / hero.css (reduced-motion safe).
const C = 300
const R = 190
const CHIP_W = 176
const CHIP_H = 40
const HUB = { w: 190, h: 104 }

const roles = [
  'FSCM Analyst',
  'HCM Consultant',
  'Cloud Architect',
  'Technical Developer',
  'Campus Specialist',
  'Reporting Analyst',
]

export default function CareersOrbitVisual() {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 600 600"
      role="img"
      aria-label="Career paths across PeopleSoft FSCM, HCM, Campus Solutions, Reporting, Cloud and technical roles"
    >
      <defs>
        <pattern id="careers-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#38BDF8" opacity="0.28" />
        </pattern>
        <filter id="careers-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="11" floodColor="#0F172A" floodOpacity="0.09" />
        </filter>
      </defs>

      {/* Backdrop */}
      <circle cx={C} cy={C} r="250" fill="#F0F9FF" />
      <circle cx={C} cy={C} r="250" fill="none" stroke="#E0F2FE" strokeWidth="1.5" />
      <rect width="600" height="600" fill="url(#careers-dots)" opacity="0.5" />
      <rect x="44" y="60" width="14" height="14" rx="4" fill="#38BDF8" opacity="0.85" transform="rotate(20 51 67)" className="hero-visual__tech-dot" />
      <rect x="520" y="470" width="12" height="12" rx="4" fill="#BAE6FD" transform="rotate(-15 526 476)" className="hero-visual__tech-dot" style={{ animationDelay: '1.2s' }} />
      <circle className="hero-visual__halo" cx={C} cy={C} r="110" fill="none" stroke="#38BDF8" strokeWidth="2" />

      {/* Static orbit track */}
      <circle cx={C} cy={C} r={R} fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeDasharray="2 10" opacity="0.7" />

      {/* Rotating orbit: travelling dot plus the role chips */}
      <g className="hero-visual__orbit" style={{ transformOrigin: `${C}px ${C}px` }}>
        <circle cx={C + R} cy={C} r="11" fill="#38BDF8" opacity="0.22" />
        <circle cx={C + R} cy={C} r="4.5" fill="#0EA5E9" />

        {roles.map((role, index) => {
          const angle = (index * 360) / roles.length
          const rad = (angle * Math.PI) / 180
          const x = C + R * Math.cos(rad)
          const y = C + R * Math.sin(rad)
          return (
            <g key={role} transform={`translate(${x} ${y})`}>
              {/* Counter-rotate about its own centre so the chip stays upright */}
              <g
                className="hero-visual__orbit"
                style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDirection: 'reverse' }}
              >
                <rect x={-CHIP_W / 2} y={-CHIP_H / 2} width={CHIP_W} height={CHIP_H} rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#careers-card)" />
                <circle cx={-CHIP_W / 2 + 20} cy="0" r="5" fill="#0EA5E9" />
                <text x={-CHIP_W / 2 + 34} y="4.5" fontSize="12" fontWeight="600" fill="#0F172A">{role}</text>
              </g>
            </g>
          )
        })}
      </g>

      {/* Central card */}
      <g filter="url(#careers-card)">
        <rect x={C - HUB.w / 2} y={C - HUB.h / 2} width={HUB.w} height={HUB.h} rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      </g>
      <rect className="hero-visual__hub" x={C - 20} y={C - 40} width="40" height="40" rx="11" fill="#0EA5E9" />
      <g transform={`translate(${C - 12} ${C - 32}) scale(1)`} fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M9 7V5h6v2" />
        <path d="M4 12h16" />
      </g>
      <text x={C} y={C + 22} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">Join our team</text>
      <text x={C} y={C + 40} textAnchor="middle" fontSize="11" fontWeight="500" fill="#64748B">Edmonton · Remote</text>
    </svg>
  )
}
