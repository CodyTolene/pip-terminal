export type FlagResult =
  | { ok: true }
  | { ok: false; reason: 'already-flagged' | 'needs-auth' | 'unknown' };
