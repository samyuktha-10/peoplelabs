import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

// Reusable animated hub diagram: a central card with module cards around it.
// Items are split between a left and right column; an optional bottom item
// sits centred beneath the hub (like the Campus card in the PeopleSoft hub).
// Motion classes come from hero.css / fx.css so every diagram shares the
// hero illustration's visual language.

const CX = 280
const CY = 270
const NODE_W = 148
const NODE_H = 64
const LEFT_X = 10
const RIGHT_X = 402
const ROW_SPACING = 100
const HUB = { w: 200, h: 104 }
HUB.x = CX - HUB.w / 2
HUB.y = CY - HUB.h / 2

// Break labels into 1-2 lines so they fit inside the card.
function splitLabel(label) {
  const words = label.split(' ')
  if (words.length === 1) return [label]
  return [words[0], words.slice(1).join(' ')]
}

function rowY(count, index) {
  return CY + (index - (count - 1) / 2) * ROW_SPACING
}

export default function EcosystemDiagram({ hubTitle, hubSubtitle, items, bottomItem = null, ariaLabel, start = true }) {
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

  const half = Math.ceil(items.length / 2)
  const leftItems = items.slice(0, half)
  const rightItems = items.slice(half)

  const nodes = [
    ...leftItems.map((item, i) => ({ ...item, side: 'left', cy: rowY(leftItems.length, i), x: LEFT_X })),
    ...rightItems.map((item, i) => ({ ...item, side: 'right', cy: rowY(rightItems.length, i), x: RIGHT_X })),
  ]

  const sideRows = nodes.map((n) => n.cy)
  const lowestSideRow = Math.max(...sideRows)
  if (bottomItem) {
    nodes.push({ ...bottomItem, side: 'bottom', cy: lowestSideRow + ROW_SPACING, x: CX - NODE_W / 2 })
  }

  const lowestCard = Math.max(...nodes.map((n) => n.cy)) + NODE_H / 2
  const VIEW_H = Math.ceil(lowestCard + 38)

  // Connectors: each card links to the hub edge (side cards) or hub bottom (bottom card).
  const connectors = nodes.map((node) => {
    if (node.side === 'left') {
      const ey = CY + (node.cy - CY) * 0.25
      const x1 = LEFT_X + NODE_W
      const x2 = HUB.x
      return { d: `M${x1} ${node.cy} C ${x1 + 14} ${node.cy}, ${x2 - 14} ${ey}, ${x2} ${ey}`, dotX: x1, dotY: node.cy }
    }
    if (node.side === 'right') {
      const ey = CY + (node.cy - CY) * 0.25
      const x1 = RIGHT_X
      const x2 = HUB.x + HUB.w
      return { d: `M${x1} ${node.cy} C ${x1 - 14} ${node.cy}, ${x2 + 14} ${ey}, ${x2} ${ey}`, dotX: x1, dotY: node.cy }
    }
    const top = node.cy - NODE_H / 2
    return { d: `M${CX} ${HUB.y + HUB.h} L ${CX} ${top}`, dotX: CX, dotY: top }
  })

  const signalDurations = ['3.5s', '4.2s', '5s', '5.8s', '4.7s', '5.3s', '4.4s', '5.6s', '3.9s', '4.9s']
  const moduleDurations = ['5.6s', '6.1s', '5.2s', '6.4s', '5.8s', '6.2s', '5.4s', '6.0s', '5.7s', '6.3s']

  return (
    <svg
      className="w-full h-auto"
      viewBox={`0 0 560 ${VIEW_H}`}
      role="img"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <defs>
        <pattern id="eco-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#38BDF8" opacity="0.28" />
        </pattern>
        <filter id="eco-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="11" floodColor="#0F172A" floodOpacity="0.09" />
        </filter>
      </defs>

      {/* Background (parallax) */}
      <motion.g style={{ x: backgroundX, y: backgroundY }}>
        <circle cx={CX} cy={CY} r="215" fill="#F0F9FF" />
        <circle cx={CX} cy={CY} r="215" fill="none" stroke="#E0F2FE" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r="236" fill="none" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="3 9" opacity="0.7" />
        <rect width="560" height={VIEW_H} fill="url(#eco-dots)" opacity="0.5" />
        <rect x="40" y="36" width="14" height="14" rx="4" fill="#38BDF8" opacity="0.85" transform="rotate(20 47 43)" className="hero-visual__tech-dot" />
        <rect x="506" y={VIEW_H - 120} width="12" height="12" rx="4" fill="#BAE6FD" transform={`rotate(-15 512 ${VIEW_H - 114})`} className="hero-visual__tech-dot" style={{ animationDelay: '1.2s' }} />
        <g fill="#0EA5E9" opacity="0.5" className="hero-visual__tech-dot">
          <circle cx="70" cy={VIEW_H - 40} r="3" /><circle cx="86" cy={VIEW_H - 32} r="3" /><circle cx="56" cy={VIEW_H - 26} r="3" />
        </g>
      </motion.g>
      <circle className="hero-visual__halo" cx={CX} cy={CY} r="100" fill="none" stroke="#38BDF8" strokeWidth="2" />

      {/* Orbit rings: dashed ring with a travelling dot, plus a slow green accent */}
      <g className="hero-visual__orbit" style={{ transformOrigin: `${CX}px ${CY}px` }} aria-hidden="true">
        <circle cx={CX} cy={CY} r="150" fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeDasharray="2 10" opacity="0.7" />
        <circle cx={CX + 150} cy={CY} r="11" fill="#38BDF8" opacity="0.22" />
        <circle cx={CX + 150} cy={CY} r="4.5" fill="#0EA5E9" />
      </g>
      <g className="hero-visual__orbit hero-visual__orbit--slow" style={{ transformOrigin: `${CX}px ${CY}px` }} aria-hidden="true">
        <circle cx={CX} cy="22" r="10" fill="#8FBF45" opacity="0.25" />
        <circle cx={CX} cy="22" r="4.5" fill="#3F8F2C" />
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
            style={{ animationDuration: signalDurations[index % signalDurations.length], animationDelay: `${index * 0.31}s` }}
          />
        ))}
      </g>
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

      {/* Central hub */}
      <g filter="url(#eco-card)">
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      </g>
      <rect className="hero-visual__hub" x={CX - 20} y={HUB.y + 10} width="40" height="40" rx="11" fill="#0EA5E9" />
      <g transform={`translate(${CX - 16.8} ${HUB.y + 13.2}) scale(1.4)`} fill="none" stroke="#FFFFFF" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
        <path d="M3 12l9 4.5L21 12" />
        <path d="M3 16.5 12 21l9-4.5" />
      </g>
      <text x={CX} y={HUB.y + 73} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#0F172A">{hubTitle}</text>
      <text x={CX} y={HUB.y + 92} textAnchor="middle" fontSize="11" fontWeight="500" fill="#64748B">{hubSubtitle}</text>

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
