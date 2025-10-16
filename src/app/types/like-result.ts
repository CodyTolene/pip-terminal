export type LikeResult =
  | { ok: true }
  | { ok: false; reason: 'already-liked' | 'needs-auth' | 'unknown' };
