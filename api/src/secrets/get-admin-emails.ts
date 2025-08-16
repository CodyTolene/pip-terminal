import { defineSecret } from 'firebase-functions/params';
import { ADMINS_SEED } from '../seeds/admins.seed';
import { isEmulator } from '../utilities';

const ADMIN_EMAILS = defineSecret('ADMIN_EMAILS');

// Cache
let cachedAdmins: readonly string[] | null = null;

function parseAdminEmails(raw: string): readonly string[] {
  // Split on comma, semicolon, whitespace, or newlines
  const parts = raw.split(/[,;\s]+/g);

  // Email normalization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const cleaned = parts
    .map((s) => s.toLowerCase().trim())
    .filter((s) => s.length > 0 && emailRegex.test(s));

  // Remove duplicates while preserving order
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const e of cleaned) {
    if (!seen.has(e)) {
      seen.add(e);
      unique.push(e);
    }
  }
  return unique;
}

export function getAdminEmails(): readonly string[] {
  if (isEmulator()) {
    // Use the seed instead of a secret for local development
    return ADMINS_SEED.map((a) => a.email.toLowerCase().trim());
  }

  if (cachedAdmins) {
    return cachedAdmins;
  }

  const raw = ADMIN_EMAILS.value();
  if (!raw) {
    throw new Error('ADMIN_EMAILS secret is not set in production');
  }

  const parsed = parseAdminEmails(raw);
  if (parsed.length === 0) {
    throw new Error('ADMIN_EMAILS secret parsed to an empty list');
  }

  cachedAdmins = parsed;
  return cachedAdmins;
}
