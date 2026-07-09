// Mounts children only while they are near the viewport, so a long page of
// live canvas demos (the /api Full Reference) never runs more than the handful
// actually in view. Off-screen, a fixed-height placeholder holds the scroll
// position and the demo's rAF loop is fully unmounted (every MiniDemo host
// cancels its frame loop on unmount). Environments without IntersectionObserver
// (jsdom tests, prerender) render children immediately.
import { ReactNode, useEffect, useRef, useState } from "react";

// How far beyond the viewport children stay mounted. Generous on purpose: demos
// mount before they scroll into view (no pop-in) and brief scroll reversals
// don't thrash mount/unmount.
const NEAR_VIEWPORT_MARGIN = "600px 0px";

export default function LazyMount({
  minHeight,
  children,
}: {
  minHeight: number;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNear(entry.isIntersecting),
      { rootMargin: NEAR_VIEWPORT_MARGIN },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} style={isNear ? undefined : { minHeight }}>
      {isNear ? children : null}
    </div>
  );
}
