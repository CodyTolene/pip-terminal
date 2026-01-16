import * as io from 'io-ts';

export const FirestoreProfileCodec = io.type(
  {
    dateOfBirth: io.union([io.string, io.null, io.undefined]),
    disableAds: io.union([io.boolean, io.null, io.undefined]),
    roomNumber: io.union([io.number, io.null, io.undefined]),
    skill: io.union([io.string, io.null, io.undefined]),
    vaultNumber: io.union([io.number, io.null, io.undefined]),
  },
  'FirestoreProfileApi',
);
