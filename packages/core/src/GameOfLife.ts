function countNeighbors(grid: ArrayLike<number>, x: number, y: number, cols: number, rows: number): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      let nx = (x + dx + cols) % cols;
      let ny = (y + dy + rows) % rows;
      count += grid[ny * cols + nx];
    }
  }
  return count;
}

/**
 * Compute the next generation of Conway's Game of Life.
 *
 * Applies the classic rules to every cell — a live cell survives with 2 or 3 live
 * neighbours, a dead cell is born with exactly 3 — using a toroidal (wrap-around)
 * grid so the edges connect. Returns a new grid rather than mutating the input.
 *
 * @param grid - The current generation as a flat row-major array of `0`/`1` (length `cols * rows`).
 * @param cols - Number of columns.
 * @param rows - Number of rows.
 * @returns A new `Uint8Array` holding the next generation.
 * @example
 * grid = gameOfLifeStep(grid, cols, rows); // advance one tick
 */
export function gameOfLifeStep(grid: ArrayLike<number>, cols: number, rows: number): Uint8Array {
  let next = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = y * cols + x;
      let n = countNeighbors(grid, x, y, cols, rows);
      if (grid[i] && (n === 2 || n === 3)) next[i] = 1;
      else if (!grid[i] && n === 3) next[i] = 1;
    }
  }
  return next;
}
