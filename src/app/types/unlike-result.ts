export type UnlikeResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'needs-auth' | 'not-owner' | 'retry-later' | 'unknown';
      message?: string;
    };
