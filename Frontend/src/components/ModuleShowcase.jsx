import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'
import Depth3D from './fx/Depth3D.jsx'
import Scroll3D from './fx/Scroll3D.jsx'

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
        <Reveal className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <h2 id={sectionTitleId} className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            {sectionTitle}
          </h2>
          <span aria-hidden="true" className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600" />
        </Reveal>

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

            <Reveal delay={0.21 + bullets.length * 0.07} className="mt-8">
              <Link
                to="/contact"
                className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 motion-reduce:transform-none hover:bg-sky-600 hover:shadow-sm active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Talk to us
                <Icon name="arrow-right" size={17} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
