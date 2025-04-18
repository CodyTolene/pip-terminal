/**
 * Convert a string to a number.
 *
 * @param input - The string to convert
 * @returns The numeric value or null if invalid
 */
export function toNumber(input: string): number | null {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? null : parsed;
}
