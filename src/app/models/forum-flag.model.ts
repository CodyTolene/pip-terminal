import { ForumFlagApi, ForumFlagCreateApi } from 'api/src/models';
import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { apiDecorator } from 'src/app/decorators';
import { decode } from 'src/app/utilities';

import { Timestamp, serverTimestamp } from '@angular/fire/firestore';

import { ClassProperties } from 'src/app/types/class-properties';

const api = apiDecorator<ForumFlagApi>();

export type ForumFlagCreate = Omit<ForumFlag, 'createdAt' | 'id'>;

export class ForumFlag {
  public constructor(props: ClassProperties<ForumFlag>) {
    this.createdAt = props.createdAt;
    this.id = props.id;
    this.reason = props.reason;
  }

  public static readonly Codec = io.type({
    createdAt: io.type({ nanoseconds: io.number, seconds: io.number }),
    id: io.string,
    reason: io.string,
  });

  /** Creation timestamp – converted to a Luxon DateTime. */
  @api({ key: 'createdAt' }) public readonly createdAt: DateTime;
  /** Firestore document identifier for this post (same as user id that created it). */
  @api({ key: 'id' }) public readonly id: string;
  /** The reason for the flagging of the forum post. */
  @api({ key: 'reason' }) public readonly reason: string;

  public static deserialize(value: unknown): ForumFlag {
    const decoded = decode(ForumFlag.Codec, value);
    const createdAtDate = new Timestamp(
      decoded.createdAt.seconds,
      decoded.createdAt.nanoseconds,
    ).toDate();
    return new ForumFlag({
      createdAt: DateTime.fromJSDate(createdAtDate),
      id: decoded.id,
      reason: decoded.reason,
    });
  }

  public static deserializeList(values: unknown[]): readonly ForumFlag[] {
    if (Array.isArray(values) === false) {
      throw new Error('Expected an array to deserialize a list of ForumFlag');
    }
    return values.map(ForumFlag.deserialize);
  }

  public static serialize(value: ForumFlagCreate): ForumFlagCreateApi {
    return {
      createdAt: serverTimestamp(),
      reason: value.reason,
    };
  }
}
