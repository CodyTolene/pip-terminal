import * as io from 'io-ts';
import { FirebaseUserCodec, FirestoreProfileCodec } from 'src/app/codecs';
import { apiDecorator } from 'src/app/decorators';
import { decode, isNonEmptyString } from 'src/app/utilities';

import { User } from '@angular/fire/auth';

type PipUserApi = io.TypeOf<typeof PipUser.Codec>;
type FirestoreProfileApi = io.TypeOf<typeof FirestoreProfileCodec>;

const api = apiDecorator<PipUserApi>();

type PipUserArgs = Omit<
  PipUser,
  // Omit getters
  | 'displayName'
  | 'email'
  | 'emailVerified'
  | 'phoneNumber'
  | 'photoURL'
  | 'uid'
  | 'vaultNumber'
>;

export class PipUser {
  public constructor(args: ClassProperties<PipUserArgs>) {
    this.native = args.native;
    this.profile = args.profile;
  }

  public static readonly Codec = io.type(
    {
      native: FirebaseUserCodec,
      profile: FirestoreProfileCodec,
    },
    'PipUserApi',
  );

  @api({ key: 'native' }) public readonly native: User;
  @api({ key: 'profile' }) public readonly profile: FirestoreProfileApi;

  public get displayName(): string | null {
    return this.native.displayName;
  }

  public get email(): string {
    if (!isNonEmptyString(this.native.email)) {
      // Email is needed for this website
      throw new Error('Invalid email');
    }
    return this.native.email;
  }

  public get emailVerified(): boolean {
    return this.native.emailVerified;
  }

  public get phoneNumber(): string | null {
    return this.native.phoneNumber || null;
  }

  public get photoURL(): string | null {
    return this.native.photoURL;
  }

  public get uid(): string {
    return this.native.uid;
  }

  public get vaultNumber(): number | null {
    return this.profile.vaultNumber || null;
  }

  public static deserialize(args: {
    user: User;
    profile?: FirestoreProfileApi;
  }): PipUser {
    decode(FirebaseUserCodec, args.user);
    const profile = decode(FirestoreProfileCodec, args.profile);
    decode(PipUser.Codec, { native: args.user, profile });
    return new PipUser({ native: args.user, profile });
  }

  public static deserializeList(
    values: readonly unknown[],
  ): readonly PipUser[] {
    if (!Array.isArray(values)) {
      throw new Error('Expected array of PipUser objects.');
    }
    return values.map(PipUser.deserialize);
  }
}
