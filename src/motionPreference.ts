import { useEffect, useState } from "react";

/**
 * Single site-wide source of truth for the OS-level "reduce motion" setting.
 *
 * Policy (Fable review §3/§4.6): when the visitor asks for reduced motion,
 * nothing auto-plays — every animation renders one static frame and waits for
 * an explicit play. User-initiated motion (dragging a demo, pressing play,
 * scrubbing a slider) is always allowed; it's the *unrequested* sweeping that
 * gets gated.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function mediaQuery(): MediaQueryList | null {
  // Guarded so this module stays importable (and classes constructible) in
  // non-browser test environments.
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }
  return window.matchMedia(QUERY);
}

/** Read the current preference. Safe anywhere, including node tests (false). */
export function prefersReducedMotion(): boolean {
  return mediaQuery()?.matches ?? false;
}

/**
 * React hook: live view of the preference. Components use it to decide
 * whether to auto-play and whether to surface a play/pause control.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mq = mediaQuery();
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
