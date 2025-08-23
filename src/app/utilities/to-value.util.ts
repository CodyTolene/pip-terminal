/**
 * Converts milliseconds to seconds.
 *
 * @param ms The time in milliseconds.
 * @returns The time in seconds.
 */
export function fromMillisecondsToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * Converts seconds to milliseconds.
 *
 * @param seconds The time in seconds.
 * @returns The time in milliseconds.
 */
export function fromSecondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}
