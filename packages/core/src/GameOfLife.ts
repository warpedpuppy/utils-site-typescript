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
