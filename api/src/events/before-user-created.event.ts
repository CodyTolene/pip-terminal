import { logger } from 'firebase-functions';
import { getAdminEmails } from '../secrets/get-admin-emails';
import { beforeUserCreated } from 'firebase-functions/v2/identity';

export const beforeUserCreatedEvent = beforeUserCreated(async (event) => {
  const email = event.data?.email?.toLowerCase().trim();
  if (!email) {
    logger.error('beforeUserCreatedEvent: No email provided in event data.');
    return {};
  }

  const adminEmailList = new Set(
    getAdminEmails().map((e) => e.toLowerCase().trim()),
  );

  // Todo: Remove
  logger.info(`Admin list: ${[...adminEmailList].join(', ')}`);

  logger.info(`Checking admin list for: ${email}`);
  const isAdmin = adminEmailList.has(email);
  const customClaims: BeforeUserCreateResponse = {
    customClaims: {
      role: isAdmin ? 'admin' : 'user',
    },
  };
  return customClaims;
});
