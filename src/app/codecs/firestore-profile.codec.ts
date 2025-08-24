import * as io from 'io-ts';

export const FirestoreProfileCodec = io.type(
  {
    dateOfBirth: io.union([io.string, io.undefined]),
    roomNumber: io.union([io.number, io.undefined]),
    skill: io.union([io.string, io.undefined]),
    vaultNumber: io.union([io.number, io.undefined]),
  },
  'FirestoreProfileApi',
);
