import { logger } from 'firebase-functions';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import { defineSecret } from 'firebase-functions/params';
import { isEmulator } from '../../utilities';
import { ADMINS_SEED } from '../../seeds';

const ADMIN_EMAILS = defineSecret('ADMIN_EMAILS');

let cachedAdmins: ReadonlySet<string> | null = null;

export const beforeUserCreatedEvent = beforeUserCreated(
  {
    maxInstances: 5,
    region: 'us-central1',
    secrets: [ADMIN_EMAILS],
  },
  async (event) => {
    const email = event.data?.email?.toLowerCase().trim();
    if (!email) {
      logger.error('beforeUserCreatedEvent: No email provided in event data.');
      return {};
    }

    let admins = cachedAdmins;

    if (!admins) {
      if (isEmulator()) {
        admins = new Set(
          ADMINS_SEED.map(({ native }) => native.email.toLowerCase().trim()),
        );
      } else {
        const raw = ADMIN_EMAILS.value();
        if (!raw)
          throw new Error('ADMIN_EMAILS secret is not set in production');

        const parsed = parseAdminEmails(raw);
        if (parsed.length === 0) {
          throw new Error('ADMIN_EMAILS secret parsed to an empty list');
        }
        admins = new Set(parsed);
      }
      cachedAdmins = admins;
    }

    const isAdmin = admins.has(email);
    logger.info(`beforeUserCreatedEvent: ${email} isAdmin=${isAdmin}`);

    return {
      customClaims: { role: isAdmin ? 'admin' : 'user' },
    };
  },
);

function parseAdminEmails(raw: string): readonly string[] {
  const parts = raw.split(/[,;\s]+/g);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const cleaned = parts
    .map((s) => s.toLowerCase().trim())
    .filter((s) => s.length > 0 && emailRegex.test(s));

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
