// Official PeopleLabs Consulting artwork (1490 × 234 → 1000 × 157 in /public).
// "dark" is the full-colour lockup for light surfaces, "light" is the white +
// mint variant for the blue surfaces (navbar, footer).
const logos = {
  dark: { src: '/peoplelabs-logo.png', width: 1000, height: 157 },
  light: { src: '/peoplelabs-logo-light.png', width: 1000, height: 157 },
}

// Brand artwork is transparent; it sits directly on the page surface.
export default function Logo({ size = 'navigation', decorative = false, tone = 'dark' }) {
  const dimensions = size === 'footer'
    ? 'h-12 w-[306px] sm:h-14 sm:w-[357px]'
    : 'h-9 w-[229px] sm:h-10 sm:w-[255px]'
  const artwork = logos[tone] || logos.dark

  return (
    <span className={`inline-flex max-w-full shrink-0 items-center justify-center ${dimensions}`}>
      <img
        src={artwork.src}
        alt={decorative ? '' : 'PeopleLabs Consulting'}
        width={artwork.width}
        height={artwork.height}
        loading={size === 'footer' ? 'lazy' : 'eager'}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </span>
  )
}
