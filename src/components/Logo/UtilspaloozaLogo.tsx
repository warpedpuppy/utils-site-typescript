import "./UtilspaloozaLogo.scss";

// Spoke/orbit relationship (Ted, 2026-07-10): noon, three, and six fly free.
// The nine, ten, two, and four spokes end with their yellow dots capping the
// orbit-ellipse tips exactly (major-axis vertices: flat orbit tip at (5.5,16);
// ±58° orbit tips at (16 ± 10.5·cos58°, 16 ∓ 10.5·sin58°) ≈ (21.6,7.1),
// (10.4,7.1), (21.6,24.9)). The long ~7-o'clock spoke keeps its length but is
// re-aimed to skewer the remaining tip at (10.4,24.9) on its way out.
const BURST_RAYS = [
  { x1: 16, y1: 16, x2: 16, y2: 1.4 },
  { x1: 16, y1: 16, x2: 21.1, y2: 7.8 },
  { x1: 16, y1: 16, x2: 31.1, y2: 16 },
  { x1: 16, y1: 16, x2: 21.1, y2: 24.2 },
  { x1: 16, y1: 16, x2: 16, y2: 26.2 },
  { x1: 16, y1: 16, x2: 7.9, y2: 29 },
  { x1: 16, y1: 16, x2: 6.4, y2: 16 },
  { x1: 16, y1: 16, x2: 10.9, y2: 7.8 },
];

const BURST_DOTS = [
  { cx: 16, cy: 1.1, r: 2.05 },
  { cx: 21.6, cy: 7.1, r: 1.2 },
  { cx: 31, cy: 16, r: 1.8 },
  { cx: 21.6, cy: 24.9, r: 1.15 },
  { cx: 16, cy: 27.6, r: 1.55 },
  { cx: 7.3, cy: 29.9, r: 1.75 },
  { cx: 5.5, cy: 16, r: 1.05 },
  { cx: 10.4, cy: 7.1, r: 1.25 },
];

// Midcentury "atomic starburst": nucleus + orbit ellipses + radiating needles with dots.
// This intentionally avoids the old square/rosette silhouette.
function UtilspaloozaLogo() {
  return (
    <svg
      className="utilspalooza-logo"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <g className="utilspalooza-logo__orbits">
        <ellipse cx="16" cy="16" rx="10.5" ry="4.2" />
        <ellipse cx="16" cy="16" rx="10.5" ry="4.2" transform="rotate(58 16 16)" />
        <ellipse cx="16" cy="16" rx="10.5" ry="4.2" transform="rotate(-58 16 16)" />
      </g>
      <g className="utilspalooza-logo__rays">
        {BURST_RAYS.map((ray) => (
          <line key={`${ray.x2}-${ray.y2}`} {...ray} />
        ))}
      </g>
      <g className="utilspalooza-logo__dots">
        {BURST_DOTS.map((dot) => (
          <circle key={`${dot.cx}-${dot.cy}`} {...dot} />
        ))}
      </g>
      <circle className="utilspalooza-logo__nucleus" cx="16" cy="16" r="3.15" />
    </svg>
  );
}

export default UtilspaloozaLogo;
