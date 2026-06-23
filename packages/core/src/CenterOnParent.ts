import { Container } from './types';

/**
 * Compute the top-left position that centers one box inside another.
 *
 * @param item - The child box being centered (its `width`/`height` are used).
 * @param parent - The container box to center within.
 * @returns The `{ x, y }` top-left coordinate that centers `item` in `parent`.
 * @example
 * centerOnParent({ width: 20, height: 10 }, { width: 100, height: 50 }); // => { x: 40, y: 20 }
 */
export function centerOnParent(item: Container, parent: Container) {
  let x = (parent.width - item.width) / 2;
  let y = (parent.height - item.height) / 2;
  return { x, y };
}
