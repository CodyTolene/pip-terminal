export function randomIntBetween(min: number, max: number): number {
  const a = Math.ceil(Math.min(min, max));
  const b = Math.floor(Math.max(min, max));
  if (a === b) {
    return a;
  }
  return a + Math.floor(Math.random() * (b - a + 1));
}
