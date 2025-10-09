import { ForumPostApi, ForumPostCreateApi } from 'api/src/models';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { apiDecorator } from 'src/app/decorators';
import { ForumCategoryEnum } from 'src/app/enums';
import { CATEGORY_TO_SLUG } from 'src/app/routing';
import { decode } from 'src/app/utilities';

import { ClassProperties } from 'src/app/types/class-properties';
import { PageUrl } from 'src/app/types/page-url';

const api = apiDecorator<ForumPostApi>();

type ForumPostArgs = Omit<ForumPost, 'categoryUrl' | 'contentPreview' | 'url'>;

export type ForumPostCreate = Omit<ForumPostArgs, 'id' | 'createdAt'>;

export class ForumPost {
  public constructor(props: ClassProperties<ForumPostArgs>) {
    this.authorId = props.authorId;
    this.authorName = props.authorName;
    this.category = props.category;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.id = props.id;
    this.title = props.title;

    const forumCategoryUrl: PageUrl = 'forum/category/:id';
    const postUrl: PageUrl = 'forum/post/:id';

    this.categoryUrl =
      '/' + forumCategoryUrl.replace(':id', CATEGORY_TO_SLUG[this.category]);
    this.contentPreview =
      this.content.length > 100
        ? `${this.content.slice(0, 100)}...`
        : this.content;
    this.url = '/' + postUrl.replace(':id', this.id);
  }

  public static readonly Codec = io.type({
    authorId: io.string,
    authorName: io.string,
    category: io.union([
      io.literal(ForumCategoryEnum.GENERAL),
      io.literal(ForumCategoryEnum.PIP_2000_MK_VI),
      io.literal(ForumCategoryEnum.PIP_3000),
      io.literal(ForumCategoryEnum.PIP_3000A),
      io.literal(ForumCategoryEnum.PIP_3000_MK_IV),
      io.literal(ForumCategoryEnum.PIP_3000_MK_V),
    ]),
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
  /** The category of the forum post. */
  @api({ key: 'category' }) public readonly category: ForumCategoryEnum;
  /** The main body content of the forum post. */
  @api({ key: 'content' }) public readonly content: string;
  /** Firestore document identifier for this post. */
  @api({ key: 'id' }) public readonly id: string;
  /** Creation timestamp – converted to a Luxon DateTime. */
  @api({ key: 'createdAt' }) public readonly createdAt: DateTime;
  /** The title of the forum post. */
  @api({ key: 'title' }) public readonly title: string;

  /** Link to view this posts category in the forum. */
  public readonly categoryUrl: string;
  /** Preview of the content, truncated to 100 characters. */
  public readonly contentPreview: string;
  /** Link to view this post in the forum. */
  public readonly url: string;

  public static deserialize(value: unknown): ForumPost {
    const decoded = decode(ForumPost.Codec, value);
    const createdAtDate = new Timestamp(
      decoded.createdAt.seconds,
      decoded.createdAt.nanoseconds,
    ).toDate();

    return new ForumPost({
      authorId: decoded.authorId,
      authorName: decoded.authorName,
      category: decoded.category,
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
      category: value.category,
      content: value.content,
      createdAt: serverTimestamp(),
      title: value.title,
    };
  }
}
