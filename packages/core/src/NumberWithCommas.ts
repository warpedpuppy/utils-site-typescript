/**
 * Format a number with comma thousands-separators.
 *
 * @param x - The number to format.
 * @returns The number as a string with a comma every three digits.
 * @example
 * numberWithCommas(1234567); // => "1,234,567"
 */
export function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
