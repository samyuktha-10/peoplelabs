import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

// Animated SVG ecosystem diagram for Oracle Fusion SCM. Reuses the same
// motion classes as the PeopleSoft hero illustration (hero.css) so the two
// diagrams share one visual language.
const subsidiaries = [
  // Left column
  {
    label: 'Product Management',
    glyph: <><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></>,
  },
  {
    label: 'Inventory Management',
    glyph: <><path d="M3 21V9l9-6 9 6v12" /><path d="M7 21v-7h10v7" /><path d="M7 17h10" /></>,
  },
  {
    label: 'Order Management',
    glyph: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9z" /><path d="M9 11h6M9 15h6" /></>,
  },
  {
    label: 'Pricing',
    glyph: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  },
  {
    label: 'RSSP',
    glyph: <><path d="M2 6h12v10H2z" /><path d="M14 10h4l4 4v2h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  },
  // Right column
  {
    label: 'Purchasing',
    glyph: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  },
  {
    label: 'Sourcing',
    glyph: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  },
  {
    label: 'Procurement Contracts',
    glyph: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>,
  },
  {
    label: 'SQM',
    glyph: <><circle cx="12" cy="8" r="6" /><path d="M8.2 13.1 7 22l5-3 5 3-1.2-8.9" /></>,
  },
  {
    label: 'Cost Management',
    glyph: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8" /></>,
  },
]

// Five nodes per side, centred vertically around the hub.
const rowCentres = [70, 170, 270, 370, 470]
const NODE_W = 148
const NODE_H = 64
const LEFT_X = 10
const RIGHT_X = 402
const HUB = { x: 190, y: 218, w: 180, h: 104 }

const nodes = subsidiaries.map((item, index) => {
  const side = index < 5 ? 'left' : 'right'
  const row = index % 5
  const cy = rowCentres[row]
  return { ...item, side, cy, x: side === 'left' ? LEFT_X : RIGHT_X }
})

// Break labels into 1-2 lines so they fit inside the card.
function splitLabel(label) {
  const words = label.split(' ')
  if (words.length === 1) return [label]
  // Two words -> one per line; longer labels -> first word / rest.
  return [words[0], words.slice(1).join(' ')]
}

const connectors = nodes.map((node) => {
  const hubEdgeY = 270 + (node.cy - 270) * 0.25
  if (node.side === 'left') {
    const x1 = LEFT_X + NODE_W
    const x2 = HUB.x
    return { d: `M${x1} ${node.cy} C ${x1 + 22} ${node.cy}, ${x2 - 22} ${hubEdgeY}, ${x2} ${hubEdgeY}`, cy: node.cy, x: x1, hubEdgeY }
  }
  const x1 = HUB.x + HUB.w
  const x2 = RIGHT_X
  return { d: `M${x2} ${node.cy} C ${x2 - 22} ${node.cy}, ${x1 + 22} ${hubEdgeY}, ${x1} ${hubEdgeY}`, cy: node.cy, x: x2, hubEdgeY }
})

const signalDurations = ['3.5s', '4.2s', '5s', '5.8s', '4.7s', '5.3s', '4.4s', '5.6s', '3.9s', '4.9s']
const moduleDurations = ['5.6s', '6.1s', '5.2s', '6.4s', '5.8s', '6.2s', '5.4s', '6.0s', '5.7s', '6.3s']

export default function ScmEcosystemVisual({ start = true }) {
  const reduceMotion = useReducedMotion()
  // Gentle pointer parallax on the backdrop, same behaviour as the hero diagram.
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

  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 560 540"
      role="img"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Oracle Fusion SCM ecosystem: Product Management, Inventory Management, Order Management, Pricing, RSSP, Purchasing, Sourcing, Procurement Contracts, SQM and Cost Management"
    >
      <defs>
        <pattern id="scm-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#38BDF8" opacity="0.28" />
        </pattern>
        <filter id="scm-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="11" floodColor="#0F172A" floodOpacity="0.09" />
        </filter>
      </defs>

      {/* Background (parallax) */}
      <motion.g style={{ x: backgroundX, y: backgroundY }}>
        <circle cx="280" cy="270" r="215" fill="#F0F9FF" />
        <circle cx="280" cy="270" r="215" fill="none" stroke="#E0F2FE" strokeWidth="1.5" />
        <circle cx="280" cy="270" r="236" fill="none" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="3 9" opacity="0.7" />
        <rect width="560" height="540" fill="url(#scm-dots)" opacity="0.5" />
        <rect x="40" y="36" width="14" height="14" rx="4" fill="#38BDF8" opacity="0.85" transform="rotate(20 47 43)" className="hero-visual__tech-dot" />
        <rect x="506" y="420" width="12" height="12" rx="4" fill="#BAE6FD" transform="rotate(-15 512 426)" className="hero-visual__tech-dot" style={{ animationDelay: '1.2s' }} />
        <g fill="#0EA5E9" opacity="0.5" className="hero-visual__tech-dot">
          <circle cx="70" cy="500" r="3" /><circle cx="86" cy="508" r="3" /><circle cx="56" cy="514" r="3" />
        </g>
      </motion.g>
      <circle className="hero-visual__halo" cx="280" cy="270" r="100" fill="none" stroke="#38BDF8" strokeWidth="2" />

      {/* Orbit rings: dashed ring with a travelling dot, plus a slow green accent */}
      <g className="hero-visual__orbit" style={{ transformOrigin: '280px 270px' }} aria-hidden="true">
        <circle cx="280" cy="270" r="150" fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeDasharray="2 10" opacity="0.7" />
        <circle cx="430" cy="270" r="11" fill="#38BDF8" opacity="0.22" />
        <circle cx="430" cy="270" r="4.5" fill="#0EA5E9" />
      </g>
      <g className="hero-visual__orbit hero-visual__orbit--slow" style={{ transformOrigin: '280px 270px' }} aria-hidden="true">
        <circle cx="280" cy="22" r="10" fill="#8FBF45" opacity="0.25" />
        <circle cx="280" cy="22" r="4.5" fill="#3F8F2C" />
      </g>

      {/* Connections */}
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
      <g fill="none" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" className="hero-visual__signals">
        {connectors.map((c, index) => (
          <path
            key={`signal-${index}`}
            d={c.d}
            strokeDasharray="2 13"
            style={{ animationDuration: signalDurations[index], animationDelay: `${index * 0.31}s` }}
          />
        ))}
      </g>
      <g fill="#0EA5E9">
        {connectors.map((c, index) => (
          <g key={`dots-${index}`}>
            <circle className="hero-visual__node" cx={c.x} cy={c.cy} r="4" style={{ animationDuration: moduleDurations[index], animationDelay: `${index * 0.37}s` }} />
          </g>
        ))}
      </g>

      {/* Central hub */}
      <g filter="url(#scm-card)">
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      </g>
      <rect className="hero-visual__hub" x="260" y="228" width="40" height="40" rx="11" fill="#0EA5E9" />
      <g transform="translate(263.2 231.2) scale(1.4)" fill="none" stroke="#FFFFFF" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
        <path d="M3 12l9 4.5L21 12" />
        <path d="M3 16.5 12 21l9-4.5" />
      </g>
      <text x="280" y="291" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0F172A">Oracle Fusion SCM</text>
      <text x="280" y="310" textAnchor="middle" fontSize="11" fontWeight="500" fill="#64748B">Connected supply chain</text>

      {/* Subsidiary cards */}
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
            <g className="hero-visual__module" style={{ animationDuration: moduleDurations[index], animationDelay: `${index * 0.28}s` }} filter="url(#scm-card)">
              <rect x={node.x} y={node.cy - NODE_H / 2} width={NODE_W} height={NODE_H} rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              <rect x={node.x + 12} y={node.cy - 16} width="32" height="32" rx="9" fill="#E0F2FE" />
              <g transform={`translate(${node.x + 18} ${node.cy - 10}) scale(0.833)`} fill="none" stroke="#0284C7" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                {node.glyph}
              </g>
              <text x={node.x + 52} y={firstBaseline} fontSize="12.5" fontWeight="600" fill="#0F172A">
                {lines.map((line, i) => (
                  <tspan key={line} x={node.x + 52} dy={i === 0 ? 0 : 16}>{line}</tspan>
                ))}
              </text>
            </g>
          </motion.g>
        )
      })}
    </svg>
  )
}
