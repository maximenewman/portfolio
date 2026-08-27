/**
 * A football pitch as a plan drawing, at the real proportions.
 *
 * Every measurement is from IFAB Law 1, scaled to a 105 x 68 m pitch and drawn
 * in decimetres (viewBox 1050 x 680): centre circle r 91.5, penalty areas
 * 403.2 x 165, goal areas 183.2 x 55, penalty marks 110 from each goal line,
 * penalty arcs r 91.5 clipped to the box edge, corner arcs r 10. The Laws cap
 * line width at 12 cm, which at this scale rounds to a hairline. That is why
 * the drawing sits comfortably in this site's rule language: real pitch lines
 * are hairlines.
 *
 * Stroke-only, currentColor, no fill. Every element carries pathLength="1" so
 * the `.line-draw` CSS can animate stroke-dashoffset without measuring paths.
 * The penalty-arc endpoints are sqrt(91.5^2 - 55^2) = 73.13 either side of
 * centre where the circle meets the box edge.
 */
export function PitchPlan({
  className = "",
  title = "Plan of a football pitch at true proportions",
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="-8 -8 1066 696"
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      vectorEffect="non-scaling-stroke"
      className={className}
    >
      {/* Perimeter and halfway line draw first. */}
      <rect x="0" y="0" width="1050" height="680" pathLength="1" />
      <line x1="525" y1="0" x2="525" y2="680" pathLength="1" />

      {/* Everything inside draws a beat later; see `.line-draw [data-late]`. */}
      <g data-late="">
        {/* Centre circle and mark */}
        <circle cx="525" cy="340" r="91.5" pathLength="1" />
        <circle cx="525" cy="340" r="2.5" pathLength="1" />

        {/* Left penalty area, goal area, mark, arc */}
        <path d="M 0 138.4 H 165 V 541.6 H 0" pathLength="1" />
        <path d="M 0 285 H 55 V 395 H 0" pathLength="1" />
        <circle cx="110" cy="340" r="2.5" pathLength="1" />
        <path d="M 165 266.9 A 91.5 91.5 0 0 1 165 413.1" pathLength="1" />

        {/* Right penalty area, goal area, mark, arc */}
        <path d="M 1050 138.4 H 885 V 541.6 H 1050" pathLength="1" />
        <path d="M 1050 285 H 995 V 395 H 1050" pathLength="1" />
        <circle cx="940" cy="340" r="2.5" pathLength="1" />
        <path d="M 885 266.9 A 91.5 91.5 0 0 0 885 413.1" pathLength="1" />

        {/* Corner arcs, r = 1 m */}
        <path d="M 10 0 A 10 10 0 0 1 0 10" pathLength="1" />
        <path d="M 1040 0 A 10 10 0 0 0 1050 10" pathLength="1" />
        <path d="M 0 670 A 10 10 0 0 1 10 680" pathLength="1" />
        <path d="M 1050 670 A 10 10 0 0 0 1040 680" pathLength="1" />
      </g>
    </svg>
  )
}
