export interface GenericObject {
  [key: string]: any;
}

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

export interface CollisionDetectionObject {
  keyFunction: Function;
  dependencies: string[];
  functionString: string;
}

export type Nullable<T> = T | null;
