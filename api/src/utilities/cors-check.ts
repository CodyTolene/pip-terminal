import type { Request, Response, NextFunction } from 'express';
import { logger } from "firebase-functions";
import { isNonEmptyString } from './type-checks';

/** Middleware for validating CORS and handling preflight. */
export function corsCheck() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
    const requestOrigin = req.headers.origin || '';
    const prodWhitelist = ['https://pip-boy.com', 'https://www.pip-boy.com'];
    const devWhitelist = ['http://localhost:4200', 'localhost:4200'];
    const corsWhitelist = isEmulator ? devWhitelist : prodWhitelist;

    const siteAllowed = corsWhitelist.includes(requestOrigin) ? requestOrigin : '';

    // logger.info('CORS Check', {
    //   siteAllowed: !!siteAllowed,
    //   origin: requestOrigin,
    //   host: req.headers.host,
    //   requestIp: req.ip,
    //   method: req.method,
    // });

    if (siteAllowed) {
      res.set('Access-Control-Allow-Origin', siteAllowed);
      res.set('Access-Control-Allow-Credentials', 'true');

      if (req.method.toUpperCase() === 'OPTIONS') {
        res.set('Access-Control-Max-Age', '86400');

        const accessControlRequestHeaders = req.headers['access-control-request-headers'];
        const accessControlRequestMethod = req.headers['access-control-request-method'];

        if (isNonEmptyString(accessControlRequestHeaders)) {
          res.set('Access-Control-Allow-Headers', accessControlRequestHeaders as string);
        }

        if (isNonEmptyString(accessControlRequestMethod)) {
          res.set('Access-Control-Allow-Methods', `OPTIONS, ${accessControlRequestMethod}`);
        }

        res.status(204).send();
        return;
      }

      next();
    } else {
      logger.warn('CORS Reject', { origin: requestOrigin });
      res.status(403).send('CORS Forbidden');
    }
  };
}
