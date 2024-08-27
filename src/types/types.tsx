export interface GenericObject {
  [key: string]: any;
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
