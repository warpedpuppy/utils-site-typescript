import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../motionPreference";

/**
 * Shared motion gate for every mini-demo host that auto-sweeps.
 *
 * `playing` starts false when the OS asks for reduced motion, so nothing
 * auto-plays; the reader can still press play (user-initiated motion is
 * always allowed) or drive the demo by hand — drags and sliders keep working
 * while the clock is frozen. `playingRef` is for rAF loops: read it per frame
 * instead of re-creating the loop on toggle.
 */
export function useMotionGate() {
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const playingRef = useRef(playing);
  playingRef.current = playing;

  // If the OS setting flips to "reduce" mid-session, freeze immediately.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setPlaying(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { playing, playingRef, setPlaying };
}

/**
 * The pause/play affordance that pairs with {@link useMotionGate}. Always
 * visible: for reduced-motion visitors it's the explicit "play" the gate
 * requires; for everyone else it's "freeze the frame so I can study it".
 */
export function MotionToggle({
  playing,
  setPlaying,
}: {
  playing: boolean;
  setPlaying: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="mini-demo__motion"
      aria-pressed={!playing}
      aria-label={playing ? "Pause the demo motion" : "Play the demo motion"}
      onClick={() => setPlaying(!playing)}
    >
      {playing ? "❚❚ pause" : "▶ play"}
    </button>
  );
}
