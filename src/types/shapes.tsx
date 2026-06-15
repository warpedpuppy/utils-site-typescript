export interface Point {
  x: number;
  y: number;
}
export interface Circle {
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
export interface Container {
  x: number;
  y: number;
  width: number;
  height: number;
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
export interface Ball extends ShapeInMotion {
  x: number;
  y: number;
  color: string;
  radius: number;
}
export interface ShapeInMotion {
  vx: number;
  vy: number;
  id: string;
}

export const InterfaceMap: Record<string, string> = {
  Point: `interface Point {
  x: number;
  y: number;
}`,
  Circle: `interface Circle {
  x: number;
  y: number;
  radius: number;
}`,
  Rectangle: `interface Rectangle extends ShapeInMotion {
  x: number;
  y: number;
  width: number;
  height: number;
}`,
  Polygon: `interface Polygon {
  vertices: Vector[];
  draw: Function;
  drag: boolean;
}`,
  Container: `interface Container {
  x: number;
  y: number;
  width: number;
  height: number;
}`,
  Vector: `interface Vector {
  x: number;
  y: number;
}`,
  Line: `interface Line {
  startPoint: Point;
  endPoint: Point;
}`,
  Triangle: `interface Triangle {
  point1: Point;
  point2: Point;
  point3: Point;
}`,
  Ball: `interface Ball extends ShapeInMotion {
  x: number;
  y: number;
  radius: number;
}`,
  ShapeInMotion: `interface ShapeInMotion {
  vx: number;
  vy: number;
  id: string;
}`,
};

export const ShapesString = `
export interface Point {
  x: number;
  y: number;
}
export interface Circle {
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
export interface Ball extends ShapeInMotion {
  x: number;
  y: number;
  radius: number;
}
export interface ShapeInMotion {
  vx: number;
  vy: number;
  id: string;
}
`;
