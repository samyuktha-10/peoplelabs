import { motion, useReducedMotion } from 'motion/react'

// Vertical light rail that fills the gap between the SCM row and the Financials row.
// It takes up exactly the gap height (96px on desktop, 40px on mobile) and is purely
// decorative (aria-hidden, pointer-events-none). Two light streaks travel down it on
// a loop. Only transform and opacity are animated. Reduced motion keeps the static rail.
const streaks = [
  { delay: 0 },
  { delay: 1.2 },
]

export default function ModuleConnector() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none relative h-10 w-full overflow-hidden bg-white lg:h-24">
      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-sky-100 via-sky-300 to-sky-100"
        initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { scaleY: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ willChange: 'transform, opacity' }}
      >
        {!reduceMotion &&
          streaks.map((s) => (
            <motion.span
              key={s.delay}
              className="absolute left-1/2 top-0 block h-1/3 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-sky-500 to-transparent shadow-[0_0_10px_2px_rgba(14,165,233,0.35)]"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: ['-100%', '300%'], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.85, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
            />
          ))}
      </motion.div>
    </div>
  )
}
