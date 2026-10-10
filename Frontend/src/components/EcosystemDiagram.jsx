import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

// Animated hub diagram. Every instance uses the same square canvas and the same
// card grid, so diagrams placed side by side are exactly equal in size.
// Cards sit in a left column and a right column around a central hub card.
//
// Motion: connector lines draw in, light packets travel along each connector,
// pulse rings expand from the hub, an orbit ring circles the hub, and cards
// float in with a stagger. Pointer movement adds a subtle parallax.

const SIZE = 600
const C = SIZE / 2
const NODE_W = 160
const NODE_H = 66
const LEFT_X = 12
const RIGHT_X = SIZE - 12 - NODE_W
const ROW_SPACING = 100
const HUB = { w: 200, h: 110 }
HUB.x = C - HUB.w / 2
HUB.y = C - HUB.h / 2

// Break labels into 1-2 lines so they fit inside the card.
function splitLabel(label) {
  const words = label.split(' ')
  if (words.length === 1) return [label]
  return [words[0], words.slice(1).join(' ')]
}

// Rows are centred on the hub, so 4 cards sit at 150-450 and 5 cards at 100-500.
function rowY(count, index) {
  return C + (index - (count - 1) / 2) * ROW_SPACING
}

export default function EcosystemDiagram({ hubTitle, hubSubtitle, left = [], right = [], ariaLabel, start = true }) {
  const reduceMotion = useReducedMotion()

  // Pointer parallax on the backdrop.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.55 })
  const springY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.55 })
  const backgroundX = useTransform(springX, (value) => value * -0.45)
  const backgroundY = useTransform(springY, (value) => value * -0.45)

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 8)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  const nodes = [
    ...left.map((item, i) => ({ ...item, side: 'left', cy: rowY(left.length, i), x: LEFT_X })),
    ...right.map((item, i) => ({ ...item, side: 'right', cy: rowY(right.length, i), x: RIGHT_X })),
  ]

  // Connectors run from each card's inner edge to the hub's side edge.
  const connectors = nodes.map((node) => {
    const ey = C + (node.cy - C) * 0.3
    if (node.side === 'left') {
      const x1 = LEFT_X + NODE_W
      const x2 = HUB.x
      return { d: `M${x1} ${node.cy} C ${x1 + 20} ${node.cy}, ${x2 - 20} ${ey}, ${x2} ${ey}`, dotX: x1, dotY: node.cy }
    }
    const x1 = RIGHT_X
    const x2 = HUB.x + HUB.w
    return { d: `M${x1} ${node.cy} C ${x1 - 20} ${node.cy}, ${x2 + 20} ${ey}, ${x2} ${ey}`, dotX: x1, dotY: node.cy }
  })

  const moduleDurations = ['5.6s', '6.1s', '5.2s', '6.4s', '5.8s', '6.2s', '5.4s', '6.0s', '5.7s', '6.3s']

  return (
    <svg
      className="block w-full h-auto"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <defs>
        <pattern id={`eco-dots-${hubTitle.replace(/\W+/g, '-')}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#38BDF8" opacity="0.28" />
        </pattern>
        <radialGradient id={`eco-glow-${hubTitle.replace(/\W+/g, '-')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <filter id="eco-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="11" floodColor="#0F172A" floodOpacity="0.09" />
        </filter>
      </defs>

      {/* Backdrop (parallax) */}
      <motion.g style={{ x: backgroundX, y: backgroundY }}>
        <circle cx={C} cy={C} r="250" fill="#F0F9FF" />
        <circle cx={C} cy={C} r="250" fill="none" stroke="#E0F2FE" strokeWidth="1.5" />
        <circle cx={C} cy={C} r="272" fill="none" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="3 9" opacity="0.7" />
        <rect width={SIZE} height={SIZE} fill={`url(#eco-dots-${hubTitle.replace(/\W+/g, '-')})`} opacity="0.5" />
        <rect x="44" y="60" width="14" height="14" rx="4" fill="#38BDF8" opacity="0.85" transform="rotate(20 51 67)" className="hero-visual__tech-dot" />
        <rect x={SIZE - 56} y={SIZE - 90} width="12" height="12" rx="4" fill="#BAE6FD" transform={`rotate(-15 ${SIZE - 50} ${SIZE - 84})`} className="hero-visual__tech-dot" style={{ animationDelay: '1.2s' }} />
        <g fill="#0EA5E9" opacity="0.5" className="hero-visual__tech-dot">
          <circle cx="70" cy={SIZE - 60} r="3" /><circle cx="86" cy={SIZE - 52} r="3" /><circle cx="56" cy={SIZE - 46} r="3" />
        </g>
      </motion.g>

      {/* Soft glow behind the hub */}
      <circle cx={C} cy={C} r="170" fill={`url(#eco-glow-${hubTitle.replace(/\W+/g, '-')})`} />

      {/* Pulse rings expanding from the hub */}
      {!reduceMotion && (
        <g fill="none" stroke="#38BDF8" strokeWidth="1.6">
          {[0, 1.5].map((delay) => (
            <circle key={delay} cx={C} cy={C} r="110">
              <animate attributeName="r" values="110;200" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Orbit ring with a travelling dot and a slow green accent */}
      <g className="hero-visual__orbit" style={{ transformOrigin: `${C}px ${C}px` }} aria-hidden="true">
        <circle cx={C} cy={C} r="170" fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeDasharray="2 10" opacity="0.7" />
        <circle cx={C + 170} cy={C} r="11" fill="#38BDF8" opacity="0.22" />
        <circle cx={C + 170} cy={C} r="4.5" fill="#0EA5E9" />
      </g>
      <g className="hero-visual__orbit hero-visual__orbit--slow" style={{ transformOrigin: `${C}px ${C}px` }} aria-hidden="true">
        <circle cx={C} cy="30" r="10" fill="#8FBF45" opacity="0.25" />
        <circle cx={C} cy="30" r="4.5" fill="#3F8F2C" />
      </g>

      {/* Connector lines */}
      <g fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" className="hero-visual__connections">
        {connectors.map((c, index) => (
          <motion.path
            key={`line-${index}`}
            d={c.d}
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={start ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.75 + index * 0.06 }}
          />
        ))}
      </g>

      {/* Light packets travelling along each connector */}
      {!reduceMotion && (
        <g>
          {connectors.map((c, index) => {
            const dur = `${2.8 + (index % 4) * 0.6}s`
            const begin = `${(index * 0.45).toFixed(2)}s`
            return (
              <g key={`packet-${index}`}>
                <circle r="7" fill="#38BDF8" opacity="0.25">
                  <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={c.d} />
                </circle>
                <circle r="3.2" fill="#0EA5E9">
                  <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={c.d} />
                </circle>
              </g>
            )
          })}
        </g>
      )}

      {/* Connection end points */}
      <g fill="#0EA5E9">
        {connectors.map((c, index) => (
          <circle
            key={`dot-${index}`}
            className="hero-visual__node"
            cx={c.dotX}
            cy={c.dotY}
            r="4"
            style={{ animationDuration: moduleDurations[index % moduleDurations.length], animationDelay: `${index * 0.37}s` }}
          />
        ))}
      </g>

      {/* Central hub card */}
      <g filter="url(#eco-card)">
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="16" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
      </g>
      <rect className="hero-visual__hub" x={C - 20} y={HUB.y + 14} width="40" height="40" rx="11" fill="#0EA5E9" />
      <g transform={`translate(${C - 16.8} ${HUB.y + 17.2}) scale(1.4)`} fill="none" stroke="#FFFFFF" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
        <path d="M3 12l9 4.5L21 12" />
        <path d="M3 16.5 12 21l9-4.5" />
      </g>
      <text x={C} y={HUB.y + 77} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#0F172A">{hubTitle}</text>
      <text x={C} y={HUB.y + 96} textAnchor="middle" fontSize="11" fontWeight="500" fill="#64748B">{hubSubtitle}</text>

      {/* Module cards */}
      {nodes.map((node, index) => {
        const lines = splitLabel(node.label)
        const firstBaseline = node.cy + 6 - (lines.length - 1) * 8
        return (
          <motion.g
            key={node.label}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 16 }}
            animate={start ? { opacity: 1, scale: 1, y: 0 } : undefined}
            transition={{ type: 'spring', stiffness: 170, damping: 16, delay: 0.55 + index * 0.07 }}
          >
            <g className="hero-visual__module" style={{ animationDuration: moduleDurations[index % moduleDurations.length], animationDelay: `${index * 0.28}s` }} filter="url(#eco-card)">
              <rect x={node.x} y={node.cy - NODE_H / 2} width={NODE_W} height={NODE_H} rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              <rect x={node.x + 12} y={node.cy - 16} width="32" height="32" rx="9" fill="#E0F2FE" />
              <g transform={`translate(${node.x + 18} ${node.cy - 10}) scale(0.833)`} fill="none" stroke="#0284C7" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                {node.glyph}
              </g>
              <text x={node.x + 54} y={firstBaseline} fontSize="13" fontWeight="600" fill="#0F172A">
                {lines.map((line, i) => (
                  <tspan key={line} x={node.x + 54} dy={i === 0 ? 0 : 16}>{line}</tspan>
                ))}
              </text>
            </g>
          </motion.g>
        )
      })}
    </svg>
  )
}
