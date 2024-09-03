export interface PrimaryObject {
  [key: string]: SubObject;
}

export interface SubObject {
  [key: string]: AnimationObject;
}

export interface GenericObject {
  [key: string]: any;
}

export interface CanvasObject {
  activeObject: AnimationObject;
}

export interface AnimationObject {
  t: string;
  l: string;
  include?: boolean;
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
  functionString: string;
}

export type Nullable<T> = T | null;
