import "./UtilspaloozaLogo.scss";

// Two overlapping squares (one diamond, one axis-aligned), both inscribed in r=12.
// Their sides cross to form 8 spikes and a central octagon — mid-century starburst.
// Octagon vertices are the exact intersections of the two squares' sides.
function UtilspaloozaLogo() {
  return (
    <svg
      className="utilspalooza-logo"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        className="utilspalooza-logo__center"
        points="19.5,7.5 24.5,12.5 24.5,19.5 19.5,24.5 12.5,24.5 7.5,19.5 7.5,12.5 12.5,7.5"
      />
      <g className="utilspalooza-logo__rings">
        <polygon points="16,4 28,16 16,28 4,16" />
        <polygon points="24.5,7.5 24.5,24.5 7.5,24.5 7.5,7.5" />
      </g>
    </svg>
  );
}

export default UtilspaloozaLogo;
