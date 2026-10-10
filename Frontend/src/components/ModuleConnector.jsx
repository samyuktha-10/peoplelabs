import { motion, useReducedMotion } from 'motion/react'

// Decorative link between two stacked module rows. A glowing line runs from the
// upper row's diagram down to the lower row's diagram, with light packets moving
// along it. Purely visual (aria-hidden); reduced-motion users get the static line.
const PATH = 'M 330 0 C 330 95, 870 105, 870 200'

const packets = [
  { begin: '0s', dur: '3.6s' },
  { begin: '1.2s', dur: '3.6s' },
  { begin: '2.4s', dur: '3.6s' },
]

export default function ModuleConnector() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="relative h-40 w-full overflow-hidden bg-white lg:h-48">
      <svg className="absolute inset-0 m-auto h-full w-full" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="connector-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Faint track */}
        <path d={PATH} fill="none" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="2 10" opacity="0.8" />

        {/* Animated line draws in as the row enters the viewport */}
        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#connector-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={reduceMotion ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {!reduceMotion && (
          <g>
            {packets.map((p) => (
              <g key={p.begin}>
                <circle r="9" fill="#38BDF8" opacity="0.25">
                  <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={PATH} />
                </circle>
                <circle r="4" fill="#0EA5E9">
                  <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={PATH} />
                </circle>
              </g>
            ))}

            {/* Pulses at the two endpoints, next to each diagram */}
            {[
              { cx: 330, cy: 0 },
              { cx: 870, cy: 200 },
            ].map((pt) => (
              <circle key={`${pt.cx}-${pt.cy}`} cx={pt.cx} cy={pt.cy} r="6" fill="none" stroke="#38BDF8" strokeWidth="1.6">
                <animate attributeName="r" values="6;22" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.8s" repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}
