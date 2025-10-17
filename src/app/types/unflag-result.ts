export type UnflagResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'needs-auth' | 'not-owner' | 'retry-later' | 'unknown';
      message?: string;
    };
