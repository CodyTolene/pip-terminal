import { defineSecret } from 'firebase-functions/params';
import { ADMINS_SEED } from '../seeds/admins.seed';

const ADMIN_EMAILS = defineSecret('ADMIN_EMAILS');

export function getAdminEmails(): readonly string[] {
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

  // if (!process.env.K_SERVICE || !process.env.FUNCTION_TARGET) {
  if (isEmulator) {
    return ADMINS_SEED.map((admin) => admin.email);
  }

  const raw = ADMIN_EMAILS.value();
  if (!raw) {
    throw new Error(`ADMIN_EMAILS secret is not set in production`);
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`ADMIN_EMAILS secret must be a JSON array`);
    }
    return parsed.map(String);
  } catch (err) {
    throw new Error(`Invalid JSON in ADMIN_EMAILS secret: ${err}`);
  }
}
