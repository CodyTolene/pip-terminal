import { ForumCommentApi, ForumCommentCreateApi } from 'api/src/models';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { apiDecorator } from 'src/app/decorators';
import { decode } from 'src/app/utilities';

import { ClassProperties } from 'src/app/types/class-properties';

const api = apiDecorator<ForumCommentApi>();

export type ForumCommentCreate = Omit<ForumComment, 'id' | 'createdAt'>;

export class ForumComment {
  public constructor(props: ClassProperties<ForumComment>) {
    this.authorId = props.authorId;
    this.authorName = props.authorName;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.id = props.id;
    this.postId = props.postId;
  }

  public static readonly Codec = io.type({
    authorId: io.string,
    authorName: io.string,
    content: io.string,
    createdAt: io.union([
      io.type({ seconds: io.number, nanoseconds: io.number }),
      io.null,
    ]),
    id: io.string,
    postId: io.string,
  });

  /** UID of the user who wrote the comment. */
  @api({ key: 'authorId' }) public readonly authorId: string;
  /** Display name (or email) of the comment author. */
  @api({ key: 'authorName' }) public readonly authorName: string;
  /** The text body of the comment. */
  @api({ key: 'content' }) public readonly content: string;
  /** Timestamp of when the comment was created. */
  @api({ key: 'createdAt' }) public readonly createdAt: DateTime;
  /** Firestore document identifier for this comment. */
  @api({ key: 'id' }) public readonly id: string;
  /** The identifier of the parent post. */
  @api({ key: 'postId' }) public readonly postId: string;

  public static deserialize(value: unknown): ForumComment {
    const decoded = decode(ForumComment.Codec, value);
    const createdAtDate = decoded.createdAt
      ? new Timestamp(
          decoded.createdAt.seconds,
          decoded.createdAt.nanoseconds,
        ).toDate()
      : new Date();

    return new ForumComment({
      authorId: decoded.authorId,
      authorName: decoded.authorName,
      content: decoded.content,
      createdAt: DateTime.fromJSDate(createdAtDate),
      id: decoded.id,
      postId: decoded.postId,
    });
  }

  public static deserializeList(values: unknown[]): readonly ForumComment[] {
    if (Array.isArray(values) === false) {
      throw new Error(
        'Expected an array to deserialize a list of ForumComment',
      );
    }
    return values.map(ForumComment.deserialize);
  }

  public static serialize(value: ForumCommentCreate): ForumCommentCreateApi {
    return {
      authorId: value.authorId,
      authorName: value.authorName,
      content: value.content,
      createdAt: serverTimestamp(),
      postId: value.postId,
    };
  }
}
