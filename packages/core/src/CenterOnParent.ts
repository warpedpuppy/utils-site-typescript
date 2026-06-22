import { Container } from './types';

export function CenterOnParent(item: Container, parent: Container) {
  let x = (parent.width - item.width) / 2;
  let y = (parent.height - item.height) / 2;
  return { x, y };
}
