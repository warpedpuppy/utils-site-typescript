export interface GenericObject {
  [key: string]: any;
}
export interface Point {
  x: number;
  y: number;
}

export interface Circle extends ShapeInMotion {
  x: number;
  y: number;
  radius: number;
}

export interface ShapeInMotion {
  vx: number;
  vy: number;
}

// canvas

export interface CanvasObject {
  activeObject: AnimationObject;
}

export interface AnimationObject {
  bf: Function;
  t: string;
  l: string;
  f: Function;
  extraHTML?: Function;
}

export type Nullable<T> = T | null;
