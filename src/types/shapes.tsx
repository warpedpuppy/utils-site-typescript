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
export interface Polygon {
  vertices: Vector[];
  draw: Function;
  drag: boolean;
}
export interface Vector {
  x: number;
  y: number;
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
