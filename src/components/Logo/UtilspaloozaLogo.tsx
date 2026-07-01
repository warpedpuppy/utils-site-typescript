import "./UtilspaloozaLogo.scss";

const BURST_RAYS = [
  { x1: 16, y1: 16, x2: 16, y2: 1.4 },
  { x1: 16, y1: 16, x2: 22.4, y2: 9.5 },
  { x1: 16, y1: 16, x2: 31.1, y2: 16 },
  { x1: 16, y1: 16, x2: 21.3, y2: 21.5 },
  { x1: 16, y1: 16, x2: 16, y2: 26.2 },
  { x1: 16, y1: 16, x2: 5.1, y2: 26.7 },
  { x1: 16, y1: 16, x2: 7.6, y2: 16 },
  { x1: 16, y1: 16, x2: 10.2, y2: 9.7 },
];

const BURST_DOTS = [
  { cx: 16, cy: 1.1, r: 2.05 },
  { cx: 23.2, cy: 8.7, r: 1.2 },
  { cx: 31, cy: 16, r: 1.8 },
  { cx: 22.1, cy: 22.3, r: 1.15 },
  { cx: 16, cy: 27.6, r: 1.55 },
  { cx: 4.2, cy: 27.3, r: 1.75 },
  { cx: 6.7, cy: 16, r: 1.05 },
  { cx: 9.3, cy: 8.9, r: 1.25 },
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
