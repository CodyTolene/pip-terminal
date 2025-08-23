import * as io from 'io-ts';

export const FirestoreProfileCodec = io.type(
  {
    vaultNumber: io.union([io.number, io.undefined]),
  },
  'FirestoreProfileApi',
);
