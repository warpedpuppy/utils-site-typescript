import "./UtilspaloozaLogo.scss";

function UtilspaloozaLogo() {
  return (
    <svg
      className="utilspalooza-logo"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="utilspalooza-logo__core" cx="16" cy="16" r="5" />
      <ellipse className="utilspalooza-logo__orbit" cx="16" cy="16" rx="12" ry="6" />
      <circle className="utilspalooza-logo__dot" cx="27" cy="16" r="3" />
    </svg>
  );
}

export default UtilspaloozaLogo;
