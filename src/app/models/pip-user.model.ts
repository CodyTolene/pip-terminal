import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { FirebaseUserCodec, FirestoreProfileCodec } from 'src/app/codecs';
import { apiDecorator } from 'src/app/decorators';
import { decode, isNonEmptyString } from 'src/app/utilities';

import { User } from '@angular/fire/auth';

import { ClassProperties } from 'src/app/types/class-properties';

type PipUserApi = io.TypeOf<typeof PipUser.Codec>;
export type FirestoreProfileApi = io.TypeOf<typeof FirestoreProfileCodec>;

const api = apiDecorator<PipUserApi>();

type PipUserArgs = Omit<
  PipUser,
  // Omit getters
  | 'dateOfBirth'
  | 'displayName'
  | 'email'
  | 'emailVerified'
  | 'isAdmin'
  | 'phoneNumber'
  | 'photoURL'
  | 'roomNumber'
  | 'skill'
  | 'uid'
  | 'vaultNumber'
>;

export class PipUser {
  public constructor(args: ClassProperties<PipUserArgs>) {
    this.native = args.native;
    this.profile = args.profile;
    this.role = args.role ?? null;
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
  public readonly role: 'admin' | 'user' | null;

  public get dateOfBirth(): DateTime | null {
    return this.profile.dateOfBirth
      ? DateTime.fromISO(this.profile.dateOfBirth)
      : null;
  }

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

  public get isAdmin(): boolean {
    return this.role === 'admin';
  }

  public get phoneNumber(): string | null {
    return this.native.phoneNumber || null;
  }

  public get photoURL(): string | null {
    return this.native.photoURL;
  }

  public get roomNumber(): number | null {
    return this.profile.roomNumber || null;
  }

  public get skill(): string | null {
    return this.profile.skill || null;
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
    role?: 'admin' | 'user' | null;
  }): PipUser {
    decode(FirebaseUserCodec, args.user);
    const profile = decode(FirestoreProfileCodec, args.profile);
    decode(PipUser.Codec, { native: args.user, profile });
    return new PipUser({
      native: args.user,
      profile,
      role: args.role ?? null,
    });
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
