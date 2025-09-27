import { ForumPostApi, ForumPostCreateApi } from 'api/src/models';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { apiDecorator } from 'src/app/decorators';
import { decode } from 'src/app/utilities';

import { ClassProperties } from 'src/app/types/class-properties';

const api = apiDecorator<ForumPostApi>();

export type ForumPostCreate = Omit<ForumPost, 'id' | 'createdAt'>;

export class ForumPost {
  public constructor(props: ClassProperties<ForumPost>) {
    this.authorId = props.authorId;
    this.authorName = props.authorName;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.id = props.id;
    this.title = props.title;
  }

  public static readonly Codec = io.type({
    authorId: io.string,
    authorName: io.string,
    content: io.string,
    createdAt: io.type({
      nanoseconds: io.number,
      seconds: io.number,
    }),
    id: io.string,
    title: io.string,
  });

  /** UID of the user who created the post. */
  @api({ key: 'authorId' }) public readonly authorId: string;
  /** Display name (or email) of the author. */
  @api({ key: 'authorName' }) public readonly authorName: string;
  /** The main body content of the forum post. */
  @api({ key: 'content' }) public readonly content: string;
  /** Firestore document identifier for this post. */
  @api({ key: 'id' }) public readonly id: string;
  /** Creation timestamp – converted to a Luxon DateTime. */
  @api({ key: 'createdAt' }) public readonly createdAt: DateTime;
  /** The title of the forum post. */
  @api({ key: 'title' }) public readonly title: string;

  public static deserialize(value: unknown): ForumPost {
    const decoded = decode(ForumPost.Codec, value);
    const createdAtDate = new Timestamp(
      decoded.createdAt.seconds,
      decoded.createdAt.nanoseconds,
    ).toDate();

    return new ForumPost({
      authorId: decoded.authorId,
      authorName: decoded.authorName,
      content: decoded.content,
      createdAt: DateTime.fromJSDate(createdAtDate),
      id: decoded.id,
      title: decoded.title,
    });
  }

  public static deserializeList(values: unknown[]): readonly ForumPost[] {
    if (Array.isArray(values) === false) {
      throw new Error('Expected an array to deserialize a list of ForumPost');
    }
    return values.map(ForumPost.deserialize);
  }

  public static serialize(value: ForumPostCreate): ForumPostCreateApi {
    return {
      authorId: value.authorId,
      authorName: value.authorName,
      content: value.content,
      createdAt: serverTimestamp(),
      title: value.title,
    };
  }
}
