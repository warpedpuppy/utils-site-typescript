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
export interface Rectangle extends ShapeInMotion {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Polygon extends Array<Vector> {}
export interface Vector {
  x: number;
  y: number;
  z: number;
}
export interface Line {
  startPoint: Point;
  endPoint: Point;
}
export interface Triangle {
  point1: Point;
  point2: Point;
  point3: Point;
}
export interface ShapeInMotion {
  vx: number;
  vy: number;
  id: string;
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
