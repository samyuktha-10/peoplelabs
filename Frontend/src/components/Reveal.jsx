import { motion, useReducedMotion } from 'motion/react'

// Fade + rise (16px) once the element is about 20% in view. Reduced-motion users
// get the content immediately with no movement.
const tags = { div: motion.div, h2: motion.h2, h3: motion.h3, p: motion.p, li: motion.li }

export default function Reveal({ as = 'div', delay = 0, className = '', children, ...props }) {
  const reduceMotion = useReducedMotion()
  const Component = tags[as] ?? motion.div

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Component>
  )
}
