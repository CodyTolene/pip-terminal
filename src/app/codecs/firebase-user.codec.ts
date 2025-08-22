import * as io from 'io-ts';

export const FirebaseUserCodec = io.type(
  {
    displayName: io.union([io.string, io.undefined]),
    email: io.union([io.string, io.undefined]),
    emailVerified: io.union([io.boolean, io.undefined]),
    isAnonymous: io.union([io.boolean, io.undefined]),
    metadata: io.partial({
      createdAt: io.string,
      creationTime: io.string,
      lastLoginAt: io.string,
      lastSignInTime: io.string,
    }),
    phoneNumber: io.union([io.string, io.undefined]),
    photoURL: io.union([io.string, io.null]),
    providerData: io.union([
      io.array(
        io.type({
          displayName: io.union([io.string, io.null]),
          email: io.union([io.string, io.null]),
          phoneNumber: io.union([io.string, io.null]),
          photoURL: io.union([io.string, io.null]),
          providerId: io.string,
          uid: io.string,
        }),
      ),
      io.undefined,
    ]),
    providerId: io.union([io.string, io.undefined]),
    refreshToken: io.union([io.string, io.undefined]),
    tenantId: io.union([io.string, io.null]),
    uid: io.string,
  },
  'FirebaseUserApi',
);
