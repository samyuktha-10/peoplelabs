import { motion, useReducedMotion } from 'motion/react'

// Oracle Fusion SCM subsidiaries (services page): five per side.
const left = [
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
]

const right = [
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

// 3D blueprint layout: a perspective floor of flattened hexagon rings and ellipses,
// extruded hub and module cards, tube-like connectors and packets that run along them.
const W = 600
const H = 520
const CX = W / 2
const CY = 260
const NODE_W = 160
const NODE_H = 66
const EXTRUDE = 6
const LEFT_X = 12
const RIGHT_X = W - 12 - NODE_W
const ROW_SPACING = 100
const HUB = { x: CX - 100, y: CY - 60, w: 200, h: 120 }
const PACKET_DURATIONS = ['2.8s', '3.4s', '3.1s', '3.6s', '3.0s']
const MODULE_DURATIONS = ['5.6s', '6.1s', '5.2s', '6.4s', '5.8s', '6.2s', '5.4s', '6.0s', '5.7s', '6.3s']

function rowY(count, index) {
  return CY + (index - (count - 1) / 2) * ROW_SPACING
}

// Break labels into 1-2 lines so they fit inside the card.
function splitLabel(label) {
  const words = label.split(' ')
  if (words.length === 1) return [label]
  return [words[0], words.slice(1).join(' ')]
}

// Regular hexagon points (pointy top) centred on the hub.
function hexPoints(radius) {
  return Array.from({ length: 6 }, (_, k) => {
    const angle = ((60 * k - 90) * Math.PI) / 180
    return `${(CX + radius * Math.cos(angle)).toFixed(2)},${(CY + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

// Flatten a group toward the viewer so it reads as a floor in perspective.
const FLOOR_TRANSFORM = `translate(${CX} ${CY}) scale(1 0.5) translate(${-CX} ${-CY})`

export default function ScmEcosystemVisual() {
  const reduceMotion = useReducedMotion()

  const nodes = [
    ...left.map((item, i) => ({ ...item, side: 'left', cy: rowY(left.length, i), x: LEFT_X, index: i })),
    ...right.map((item, i) => ({ ...item, side: 'right', cy: rowY(right.length, i), x: RIGHT_X, index: i })),
  ]

  // Connection points on the hub edge, one per card, top to bottom.
  const hubPointY = (index) => HUB.y + 14 + index * 23

  const connectors = nodes.map((node) => {
    const hy = hubPointY(node.index)
    if (node.side === 'left') {
      const x1 = node.x + NODE_W
      const x2 = HUB.x
      return { d: `M${x1} ${node.cy} C ${x1 + 24} ${node.cy}, ${x2 - 24} ${hy}, ${x2} ${hy}`, dotX: x1, dotY: node.cy }
    }
    const x1 = node.x
    const x2 = HUB.x + HUB.w
    return { d: `M${x1} ${node.cy} C ${x1 - 24} ${node.cy}, ${x2 + 24} ${hy}, ${x2} ${hy}`, dotX: x1, dotY: node.cy }
  })

  return (
    <svg
      className="block h-auto w-full"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Oracle Fusion SCM ecosystem: Product Management, Inventory Management, Order Management, Pricing, RSSP, Purchasing, Sourcing, Procurement Contracts, SQM and Cost Management"
    >
      <defs>
        <radialGradient id="scm-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.42" />
          <stop offset="70%" stopColor="#BAE6FD" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scm-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F8FD" />
        </linearGradient>
        <linearGradient id="scm-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFE6F5" />
          <stop offset="100%" stopColor="#8EC2E3" />
        </linearGradient>
        <linearGradient id="scm-chip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6F6FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
        <linearGradient id="scm-hub-chip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id="scm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scm-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.6" />
        </linearGradient>
        <filter id="scm-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#0C4A6E" floodOpacity="0.16" />
        </filter>
        <filter id="scm-hub-shadow" x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Perspective floor: flattened hexagon rings, ellipses and a soft glow (no pattern) */}
      <ellipse cx={CX} cy={CY + 118} rx="236" ry="50" fill="url(#scm-floor)" />
      <g transform={FLOOR_TRANSFORM}>
        <polygon points={hexPoints(236)} fill="none" stroke="#BAE6FD" strokeWidth="1.4" opacity="0.9" />
        <polygon
          points={hexPoints(186)}
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.2"
          strokeDasharray="4 10"
          className={reduceMotion ? undefined : 'scm-spin-slow'}
        />
      </g>
      <ellipse cx={CX} cy={CY} r="170" fill="url(#scm-glow)" />
      <ellipse cx={CX} cy={CY + 26} rx="116" ry="44" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.5" />

      {/* Sweep line from the hub outward */}
      {!reduceMotion && (
        <line x1={CX} y1={CY} x2={CX + 236} y2={CY} stroke="url(#scm-sweep)" strokeWidth="2" className="scm-sweep" />
      )}

      {/* Connectors: tube-like (soft wide under-stroke + bright line). Draw in once, staggered. */}
      <g fill="none" strokeLinecap="round">
        {connectors.map((c, index) => (
          <motion.path
            key={`tube-${index}`}
            d={c.d}
            stroke="#BAE6FD"
            strokeWidth="7"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 0.45 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.15 + index * 0.06 }}
          />
        ))}
        {connectors.map((c, index) => (
          <motion.path
            key={`line-${index}`}
            d={c.d}
            stroke="#0EA5E9"
            strokeWidth="2"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.15 + index * 0.06 }}
          />
        ))}
      </g>

      {/* Light packets running along each connector (low opacity) */}
      {!reduceMotion && (
        <g>
          {connectors.map((c, index) => {
            const dur = PACKET_DURATIONS[index % PACKET_DURATIONS.length]
            const begin = `${(index * 0.4).toFixed(2)}s`
            return (
              <g key={`packet-${index}`}>
                <circle r="7" fill="#38BDF8" opacity="0.18">
                  <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={c.d} />
                </circle>
                <circle r="3" fill="#0EA5E9" opacity="0.7">
                  <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={c.d} />
                </circle>
              </g>
            )
          })}
        </g>
      )}

      {/* Connection end points on the hub edge */}
      <g fill="#0EA5E9">
        {connectors.map((c, index) => (
          <circle
            key={`dot-${index}`}
            className={reduceMotion ? undefined : 'hero-visual__node'}
            cx={c.dotX}
            cy={c.dotY}
            r="4"
            style={{ animationDuration: MODULE_DURATIONS[index % MODULE_DURATIONS.length], animationDelay: `${index * 0.37}s` }}
          />
        ))}
      </g>

      {/* Hub: extruded block with a gradient top face */}
      <ellipse cx={CX} cy={HUB.y + HUB.h + 18} rx="96" ry="9" fill="#0F172A" opacity="0.14" filter="url(#scm-hub-shadow)" />
      <g>
        <rect x={HUB.x} y={HUB.y + 10} width={HUB.w} height={HUB.h} rx="28" fill="#7DD3FC" opacity="0.55" />
        <rect x={HUB.x} y={HUB.y + 6} width={HUB.w} height={HUB.h} rx="28" fill="url(#scm-side)" />
        <g filter="url(#scm-card)">
          <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="28" fill="url(#scm-face)" stroke="#BAE6FD" strokeWidth="1.5" />
        </g>
        <path d={`M${HUB.x + 22} ${HUB.y + 1.5} H${HUB.x + HUB.w - 22}`} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <rect x={CX - 20} y={HUB.y + 12} width="40" height="40" rx="12" fill="url(#scm-hub-chip)" />
        <rect x={CX - 20} y={HUB.y + 12} width="40" height="40" rx="12" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1" />
        <g transform={`translate(${CX - 16.8} ${HUB.y + 14.2}) scale(1.4)`} fill="none" stroke="#FFFFFF" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
          <path d="M3 12l9 4.5L21 12" />
          <path d="M3 16.5 12 21l9-4.5" />
        </g>
        <text x={CX} y={HUB.y + 74} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#0F172A">
          Oracle Fusion SCM
        </text>
        <text x={CX} y={HUB.y + 94} textAnchor="middle" fontSize="11" fontWeight="500" fill="#64748B">
          Connected supply chain
        </text>
      </g>

      {/* Module cards: extruded faces, staggered reveal, then a gentle float */}
      {nodes.map((node, index) => {
        const lines = splitLabel(node.label)
        const firstBaseline = node.cy + 6 - (lines.length - 1) * 8
        const top = node.cy - NODE_H / 2
        return (
          <motion.g
            key={node.label}
            style={{ transformBox: 'fill-box', transformOrigin: 'center', willChange: 'transform, opacity' }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 170, damping: 16, delay: 0.3 + index * 0.07 }}
          >
            <g
              className={reduceMotion ? undefined : 'hero-visual__module'}
              style={{ animationDuration: MODULE_DURATIONS[index % MODULE_DURATIONS.length], animationDelay: `${index * 0.28}s` }}
              filter="url(#scm-card)"
            >
              <rect x={node.x} y={top + EXTRUDE} width={NODE_W} height={NODE_H} rx="12" fill="url(#scm-side)" />
              <rect x={node.x} y={top} width={NODE_W} height={NODE_H} rx="12" fill="url(#scm-face)" stroke="#DCE7F1" strokeWidth="1.2" />
              <path d={`M${node.x + 12} ${top + 1.5} H${node.x + NODE_W - 12}`} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <rect x={node.x + 12} y={node.cy - 16} width="32" height="32" rx="9" fill="url(#scm-chip)" />
              <g transform={`translate(${node.x + 18} ${node.cy - 10}) scale(0.833)`} fill="none" stroke="#0284C7" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                {node.glyph}
              </g>
              <text x={node.x + 54} y={firstBaseline} fontSize="13" fontWeight="600" fill="#0F172A">
                {lines.map((line, i) => (
                  <tspan key={line} x={node.x + 54} dy={i === 0 ? 0 : 16}>
                    {line}
                  </tspan>
                ))}
              </text>
              <circle cx={node.x + NODE_W - 12} cy={top + 12} r="3" fill="#0EA5E9" className={reduceMotion ? undefined : 'hero-visual__node'} />
            </g>
          </motion.g>
        )
      })}
    </svg>
  )
}
