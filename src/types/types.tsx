export interface GenericObject {
  [key: string]: any;
}
export type Point = {
  x: number;
  y: number;
};

// canvas

export type CanvasObject = {
  activeObject: AnimationObject;
};

export type AnimationObject = {
  bf: Function;
  t: string;
  l: string;
  f: Function;
  extraHTML?: Function;
};

export type Nullable<T> = T | null;
