import { motion, useReducedMotion } from 'motion/react'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'
import Depth3D from './fx/Depth3D.jsx'
import Scroll3D from './fx/Scroll3D.jsx'

// Section title where each letter rises in once, staggered. Reduced-motion users
// get the plain heading. The aria-label keeps the full title for screen readers.
function LetterHeading({ id, text, className }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <h2 id={id} className={className}>
        {text}
      </h2>
    )
  }

  return (
    <h2 id={id} aria-label={text} className={className}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: '0.45em' }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity' }}
        >
          {char}
        </motion.span>
      ))}
    </h2>
  )
}

// One zig-zag row with its own section title. The diagram and the copy swap sides
// on lg+ when `reverse` is set. Below lg the title comes first, then the diagram,
// then the copy, for every row.
//
// placement="first" gives the row top padding; placement="last" removes top padding
// so the connector spacer sets the gap between the two rows.
export default function ModuleShowcase({
  id,
  sectionTitle,
  eyebrow,
  title,
  description,
  bullets,
  diagram,
  reverse = false,
  placement = 'middle',
}) {
  const sectionTitleId = `${id}-section-title`
  const headingId = `${id}-heading`
  const sectionPadding = placement === 'first' ? 'pt-10 sm:pt-12 lg:pt-14 pb-0' : 'pt-0 pb-12 sm:pb-16 lg:pb-20'

  return (
    <section aria-labelledby={sectionTitleId} className={`bg-white ${sectionPadding}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <LetterHeading
            id={sectionTitleId}
            text={sectionTitle}
            className="text-3xl font-bold tracking-tight text-sky-700 lg:text-4xl"
          />
          <span aria-hidden="true" className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14">
          <Reveal className={`mx-auto w-full max-w-[600px] ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <Scroll3D>
              <Depth3D max={6} float={false}>
                {diagram}
              </Depth3D>
            </Scroll3D>
          </Reveal>

          <div className={`w-full ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            <Reveal as="p" delay={0} className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              {eyebrow}
            </Reveal>
            <Reveal as="h3" delay={0.07} id={headingId} className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </Reveal>
            <Reveal as="p" delay={0.14} className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {description}
            </Reveal>

            <ul className="mt-6 grid gap-3">
              {bullets.map((item, index) => (
                <Reveal
                  as="li"
                  key={item}
                  delay={0.21 + index * 0.07}
                  className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base"
                >
                  <span className="mt-1 shrink-0 text-sky-600" aria-hidden="true">
                    <Icon name="check-circle" size={18} strokeWidth={2} />
                  </span>
                  <span>{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
