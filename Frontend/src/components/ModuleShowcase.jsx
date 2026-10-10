import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { FadeUp } from './motion/MotionPrimitives.jsx'

// One zig-zag row: an animated diagram on one side and module copy on the other.
// On lg+ the row alternates when `reverse` is set; below lg the diagram always
// comes first and the copy follows, so small screens stack the same way for every row.
export default function ModuleShowcase({ id, eyebrow, title, description, bullets, diagram, reverse = false }) {
  const headingId = `${id}-heading`

  return (
    <section aria-labelledby={headingId} className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[55fr_45fr] lg:gap-14 lg:px-8">
        <FadeUp className={`mx-auto w-full max-w-[600px] ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
          {diagram}
        </FadeUp>

        <FadeUp className={`w-full ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{eyebrow}</p>
          <h3 id={headingId} className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>

          <ul className="mt-6 grid gap-3">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base">
                <span className="mt-1 shrink-0 text-sky-600" aria-hidden="true">
                  <Icon name="check-circle" size={18} strokeWidth={2} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              to="/contact"
              className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 motion-reduce:transform-none hover:bg-sky-600 hover:shadow-sm active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Talk to us
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
