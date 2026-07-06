import type { ReactNode } from "react";

export interface PrimaryObject {
  [key: string]: SubObject;
}

export interface SubObject {
  [key: string]: AnimationObject;
}

export interface CanvasObject {
  activeObject: AnimationObject;
}

export interface AnimationObject {
  t: string;
  l: string;
  include?: boolean;
  relatedObject?: CollisionDetectionObject;
  f: CollisionDetectionObject;
  extraHTML?: Function;
}

export interface HSL {
  H: number;
  S: number;
  L: number;
}

export interface CollisionDetectionObject {
  keyFunction: Function;
  dependencies: string[];
  interfaces?: string[];
  functionString: string;
}

/**
 * The runtime surface the Examples/Studio hosts rely on. Every animation
 * class (via AnimationBaseClass or animationTemplate) satisfies it.
 */
export interface AnimationInstance {
  init(): void;
  stop(): void;
  /** Motion gate — true while the reduced-motion hold (or a user pause) is on. */
  motionPaused: boolean;
  resumeMotion(): void;
  pauseMotion(): void;
  animationObject?: CollisionDetectionObject;
  /** Optional per-animation header controls (rendered via setState-updater). */
  extraHTML?: () => ReactNode;
}

/** Deferred constructor wrapper — see ExamplesUtils.createClassReference. */
export interface AnimationClassRef {
  initiate(containerId: string): AnimationInstance;
}

export type Nullable<T> = T | null;

export interface Point {
  x: number;
  y: number;
}
