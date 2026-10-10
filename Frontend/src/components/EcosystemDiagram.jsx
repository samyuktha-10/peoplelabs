import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

// Animated 3D hub diagram. Every instance uses the same canvas and card grid, so the
// SCM and Financials diagrams match exactly.
//
// 3D treatment (SVG only, no pattern):
//  - a perspective floor (flattened ellipses) sits under the hub
//  - the hub and each module card are extruded: a darker layer sits underneath,
//    and the top face uses a soft vertical gradient with a highlight edge
//  - connectors are tube-like: a wide soft under-stroke with the bright line on top
//
// Motion (transform and opacity only):
//  - connector lines draw in once when they scroll into view, staggered
//  - light packets travel along each connector (low opacity)
//  - pulse rings expand from the hub, and an orbit dot circles it
//  - the hub card floats gently (CSS, see hero.css) above a soft shadow
//  - module cards sit at different depths and drift at different speeds on scroll
//  - pointer movement tilts the floor slightly
// Reduced-motion users get the static layout.

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
const HUB = { w: 200, h: 110 }
HUB.x = CX - HUB.w / 2
HUB.y = CY - HUB.h / 2

// Relative depth per card: larger values move further on scroll.
const DEPTHS = [0.7, 1.2, 0.9, 1.4, 1.0, 0.8, 1.3, 1.1, 0.6]

// Break labels into 1-2 lines so they fit inside the card.
function splitLabel(label) {
  const words = label.split(' ')
  if (words.length === 1) return [label]
  return [words[0], words.slice(1).join(' ')]
}

// Rows are centred on the hub: 4 cards sit at 150-450 and 5 cards at 60-460.
function rowY(count, index) {
  return CY + (index - (count - 1) / 2) * ROW_SPACING
}

function ParallaxLayer({ progress, depth, children }) {
  const y = useTransform(progress, [0, 1], [-depth * 7, depth * 7])
  return <motion.g style={{ y, willChange: 'transform' }}>{children}</motion.g>
}

export default function EcosystemDiagram({ hubTitle, hubSubtitle, left = [], right = [], ariaLabel }) {
  const reduceMotion = useReducedMotion()
  const svgRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: svgRef, offset: ['start end', 'end start'] })

  // Pointer tilt on the floor.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.55 })
  const springY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.55 })
  const floorX = useTransform(springX, (value) => value * -0.45)
  const floorY = useTransform(springY, (value) => value * -0.45)

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

  const uid = hubTitle.replace(/\W+/g, '-')
  const nodes = [
    ...left.map((item, i) => ({ ...item, side: 'left', cy: rowY(left.length, i), x: LEFT_X })),
    ...right.map((item, i) => ({ ...item, side: 'right', cy: rowY(right.length, i), x: RIGHT_X })),
  ]

  // Connectors run from each card's inner edge to the hub's side edge.
  const connectors = nodes.map((node) => {
    const ey = CY + (node.cy - CY) * 0.3
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
      ref={svgRef}
      className="block w-full h-auto"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <defs>
        <radialGradient id={`eco-floor-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.42" />
          <stop offset="70%" stopColor="#BAE6FD" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`eco-face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F8FD" />
        </linearGradient>
        <linearGradient id={`eco-side-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFE6F5" />
          <stop offset="100%" stopColor="#8EC2E3" />
        </linearGradient>
        <linearGradient id={`eco-chip-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6F6FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
        <linearGradient id={`eco-hub-chip-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id={`eco-glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <filter id={`eco-card-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#0C4A6E" floodOpacity="0.16" />
        </filter>
        <filter id={`eco-hub-shadow-${uid}`} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Perspective floor (pointer tilt): flattened rings and a soft glow */}
      <motion.g style={{ x: floorX, y: floorY }}>
        <ellipse cx={CX} cy={CY + 118} rx="236" ry="50" fill={`url(#eco-floor-${uid})`} />
        <ellipse cx={CX} cy={CY + 26} rx="236" ry="92" fill="none" stroke="#BAE6FD" strokeWidth="1.4" opacity="0.8" />
        <ellipse cx={CX} cy={CY + 26} rx="176" ry="68" fill="none" stroke="#7DD3FC" strokeWidth="1.2" opacity="0.7" />
        <ellipse cx={CX} cy={CY + 26} rx="116" ry="44" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.5" />
      </motion.g>

      {/* Soft glow behind the hub */}
      <circle cx={CX} cy={CY} r="170" fill={`url(#eco-glow-${uid})`} />

      {/* Pulse rings expanding from the hub, flattened to match the floor */}
      {!reduceMotion && (
        <g fill="none" stroke="#38BDF8" strokeWidth="1.6">
          {[0, 1.5].map((delay) => (
            <ellipse key={delay} cx={CX} cy={CY + 26} rx="116" ry="44">
              <animate attributeName="rx" values="116;236" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="ry" values="44;92" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
        </g>
      )}

      {/* Orbit ring with a travelling dot and a slow green accent */}
      <g className="hero-visual__orbit" style={{ transformOrigin: `${CX}px ${CY}px` }} aria-hidden="true">
        <circle cx={CX} cy={CY} r="170" fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeDasharray="2 10" opacity="0.7" />
        <circle cx={CX + 170} cy={CY} r="11" fill="#38BDF8" opacity="0.22" />
        <circle cx={CX + 170} cy={CY} r="4.5" fill="#0EA5E9" />
      </g>
      <g className="hero-visual__orbit hero-visual__orbit--slow" style={{ transformOrigin: `${CX}px ${CY}px` }} aria-hidden="true">
        <circle cx={CX} cy="30" r="10" fill="#8FBF45" opacity="0.25" />
        <circle cx={CX} cy="30" r="4.5" fill="#3F8F2C" />
      </g>

      {/* Connectors: tube-like (soft wide under-stroke + bright line). Draw in once, staggered. */}
      <g fill="none" strokeLinecap="round">
        {connectors.map((c, index) => (
          <motion.path
            key={`tube-${index}`}
            d={c.d}
            stroke="#BAE6FD"
            strokeWidth="7"
            opacity="0.45"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 0.45 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.15 + index * 0.08 }}
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
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.15 + index * 0.08 }}
          />
        ))}
      </g>

      {/* Light packets travelling along each connector (low opacity) */}
      {!reduceMotion && (
        <g>
          {connectors.map((c, index) => {
            const dur = `${2.8 + (index % 4) * 0.6}s`
            const begin = `${(index * 0.45).toFixed(2)}s`
            return (
              <g key={`packet-${index}`}>
                <circle r="7" fill="#38BDF8" opacity="0.18">
                  <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={c.d} />
                </circle>
                <circle r="3.2" fill="#0EA5E9" opacity="0.75">
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
          <circle key={`dot-${index}`} className="hero-visual__node" cx={c.dotX} cy={c.dotY} r="4" style={{ animationDuration: moduleDurations[index % moduleDurations.length], animationDelay: `${index * 0.37}s` }} />
        ))}
      </g>

      {/* Hub: extruded block with a gradient top face and floating motion */}
      <ellipse cx={CX} cy={HUB.y + HUB.h + 18} rx="96" ry="9" fill="#0F172A" opacity="0.14" filter={`url(#eco-hub-shadow-${uid})`} />
      <g className={reduceMotion ? undefined : 'eco-hub'}>
        <rect x={HUB.x} y={HUB.y + 10} width={HUB.w} height={HUB.h} rx="16" fill="#7DD3FC" opacity="0.55" />
        <rect x={HUB.x} y={HUB.y + 6} width={HUB.w} height={HUB.h} rx="16" fill={`url(#eco-side-${uid})`} />
        <g filter={`url(#eco-card-${uid})`}>
          <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="16" fill={`url(#eco-face-${uid})`} stroke="#BAE6FD" strokeWidth="1.5" />
        </g>
        <path d={`M${HUB.x + 14} ${HUB.y + 1.5} H${HUB.x + HUB.w - 14}`} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <rect x={CX - 20} y={HUB.y + 14} width="40" height="40" rx="11" fill={`url(#eco-hub-chip-${uid})`} />
        <rect x={CX - 20} y={HUB.y + 14} width="40" height="40" rx="11" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1" />
        <g transform={`translate(${CX - 16.8} ${HUB.y + 17.2}) scale(1.4)`} fill="none" stroke="#FFFFFF" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
          <path d="M3 12l9 4.5L21 12" />
          <path d="M3 16.5 12 21l9-4.5" />
        </g>
        <text x={CX} y={HUB.y + 77} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#0F172A">{hubTitle}</text>
        <text x={CX} y={HUB.y + 96} textAnchor="middle" fontSize="11" fontWeight="500" fill="#64748B">{hubSubtitle}</text>
      </g>

      {/* Module cards: extruded faces, depth parallax on scroll, then a staggered reveal */}
      {nodes.map((node, index) => {
        const lines = splitLabel(node.label)
        const firstBaseline = node.cy + 6 - (lines.length - 1) * 8
        const top = node.cy - NODE_H / 2
        const card = (
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center', willChange: 'transform, opacity' }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.7, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 170, damping: 16, delay: 0.3 + index * 0.07 }}
          >
            <g className="hero-visual__module" style={{ animationDuration: moduleDurations[index % moduleDurations.length], animationDelay: `${index * 0.28}s` }} filter={`url(#eco-card-${uid})`}>
              <rect x={node.x} y={top + EXTRUDE} width={NODE_W} height={NODE_H} rx="12" fill={`url(#eco-side-${uid})`} />
              <rect x={node.x} y={top} width={NODE_W} height={NODE_H} rx="12" fill={`url(#eco-face-${uid})`} stroke="#DCE7F1" strokeWidth="1.2" />
              <path d={`M${node.x + 12} ${top + 1.5} H${node.x + NODE_W - 12}`} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <rect x={node.x + 12} y={node.cy - 16} width="32" height="32" rx="9" fill={`url(#eco-chip-${uid})`} />
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
        return reduceMotion ? (
          <g key={node.label}>{card}</g>
        ) : (
          <ParallaxLayer key={node.label} progress={scrollYProgress} depth={DEPTHS[index % DEPTHS.length]}>
            {card}
          </ParallaxLayer>
        )
      })}
    </svg>
  )
}
