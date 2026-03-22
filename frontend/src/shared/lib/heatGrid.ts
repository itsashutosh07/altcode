/** Deterministic pseudo-heatmap columns for dashboard / study overview. */
export function heatGrid(seed: number, cols: number, rows: number): number[][] {
  const grid: number[][] = []
  for (let c = 0; c < cols; c++) {
    const col: number[] = []
    for (let r = 0; r < rows; r++) {
      const x = Math.sin(seed * 0.07 + c * 1.9 + r * 2.3)
      col.push(Math.min(4, Math.max(0, Math.floor((x + 1) * 2.2))))
    }
    grid.push(col)
  }
  return grid
}
