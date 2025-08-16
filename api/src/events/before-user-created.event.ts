import { logger } from 'firebase-functions';
import { getAdminEmails } from '../secrets/get-admin-emails';
import { beforeUserCreated } from 'firebase-functions/v2/identity';

export const beforeUserCreatedEvent = beforeUserCreated(async (event) => {
  const email = event.data?.email?.toLowerCase().trim();
  if (!email) {
    logger.error('beforeUserCreatedEvent: No email provided in event data.');
    return {};
  }

  const admins = new Set(getAdminEmails());
  const isAdmin = admins.has(email);

  logger.info(`beforeUserCreatedEvent: ${email} isAdmin=${isAdmin}`);

  const customClaims: BeforeUserCreateResponse = {
    customClaims: { role: isAdmin ? 'admin' : 'user' },
  };
  return customClaims;
});
