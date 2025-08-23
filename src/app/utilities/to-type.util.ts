/**
 * Convert a string to a number.
 *
 * @param input - The string to convert
 * @returns The numeric value or null if invalid
 */
export function toNumber(input: string | null): number | null {
  const parsed = input ? parseFloat(input) : null;
  return parsed !== null && isNaN(parsed) ? null : parsed;
}
