// Official PeopleLabs Consulting artwork. This component is a thin wrapper so
// every existing call site renders the brand logo from /public.
const artwork = {
  dark: { src: '/peoplelabs-logo.png', width: 1000, height: 157 },
  light: { src: '/peoplelabs-logo-light.png', width: 1000, height: 157 },
}

const heights = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-14',
  intro: 'h-20',
}

export default function PeopleLabLogo({
  size = 'md',
  animated = false,
  darkBackground = false,
  className = '',
}) {
  const image = darkBackground ? artwork.light : artwork.dark
  const height = heights[size] || heights.md

  return (
    <span className={`inline-flex select-none items-center ${className}`.trim()}>
      <img
        src={image.src}
        alt="PeopleLabs Consulting"
        width={image.width}
        height={image.height}
        decoding="async"
        className={`w-auto max-w-full object-contain transition-transform duration-300 ${height} ${
          animated ? 'hover:scale-[1.03] motion-reduce:transform-none' : ''
        }`}
      />
    </span>
  )
}
