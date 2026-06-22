// Geometry primitives shared across @utilspalooza/core.
// These are the canonical definitions; the site re-exports them from here.

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Line {
  startPoint: Point;
  endPoint: Point;
}

export interface Polygon {
  vertices: Vector[];
}

export interface Container {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeInMotion {
  vx: number;
  vy: number;
  id: string;
}

export interface Ball extends ShapeInMotion {
  x: number;
  y: number;
  color: string;
  radius: number;
}
