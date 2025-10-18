/**
 * Computes the decoded byte length of a Base64 payload from a data URL or a raw Base64 string.
 */
export function dataUrlBytes(v: string): number {
  const comma = v.indexOf(',');
  const b64 = comma >= 0 ? v.slice(comma + 1) : v;
  const len = b64.length;
  const pad = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((len * 3) / 4) - pad;
}

/**
 * Extracts the MIME type from a data URL string.
 */
export function dataUrlMime(v: string): string {
  const start = v.indexOf(':') + 1;
  const end = v.indexOf(';', start);
  return start > 0 && end > start ? v.slice(start, end) : '';
}

/**
 * Computes the byte length of an image-like input.
 */
export function extractImageBytes(value: unknown): number | null {
  if (isFileOrBlob(value)) {
    return (value as Blob).size ?? null;
  }
  if (typeof value === 'string' && isDataUrl(value)) {
    return dataUrlBytes(value);
  }
  return null;
}

/**
 * Determines whether a string is a base64-encoded Data URL.
 */
export function isDataUrl(v: string): boolean {
  return /^data:[^;]+;base64,/.test(v);
}

/**
 * Type guard that determines whether a value is a `File` or `Blob`-like object.
 */
export function isFileOrBlob(v: unknown): v is File | Blob {
  return typeof v === 'object' && v !== null && 'size' in v && 'type' in v;
}
