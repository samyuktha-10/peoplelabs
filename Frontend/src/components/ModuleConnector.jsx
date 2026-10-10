import { motion, useReducedMotion } from 'motion/react'

// Small S-curve that fills the gap between the SCM row and the Financials row.
// It takes up exactly the gap height (96px on desktop, 40px on mobile) and is
// purely decorative (aria-hidden, pointer-events-none).
const PATH = 'M 330 0 C 330 40, 870 56, 870 96'

const packets = [
  { begin: '0s', dur: '3.6s' },
  { begin: '1.2s', dur: '3.6s' },
  { begin: '2.4s', dur: '3.6s' },
]

export default function ModuleConnector() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none relative h-10 w-full overflow-hidden bg-white lg:h-24">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 96" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="connector-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <path d={PATH} fill="none" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="2 10" opacity="0.8" />

        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#connector-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={reduceMotion ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {!reduceMotion && (
          <g>
            {packets.map((p) => (
              <g key={p.begin}>
                <circle r="7" fill="#38BDF8" opacity="0.15">
                  <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={PATH} />
                </circle>
                <circle r="3" fill="#0EA5E9" opacity="0.6">
                  <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={PATH} />
                </circle>
              </g>
            ))}
            {[
              { cx: 330, cy: 0 },
              { cx: 870, cy: 96 },
            ].map((pt) => (
              <circle key={`${pt.cx}-${pt.cy}`} cx={pt.cx} cy={pt.cy} r="5" fill="none" stroke="#38BDF8" strokeWidth="1.4">
                <animate attributeName="r" values="5;14" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2.8s" repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}
