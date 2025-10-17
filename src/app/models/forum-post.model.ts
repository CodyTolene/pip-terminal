import { ForumPostApi, ForumPostCreateApi } from 'api/src/models';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { apiDecorator } from 'src/app/decorators';
import { ForumCategoryEnum } from 'src/app/enums';
import { CATEGORY_TO_SLUG } from 'src/app/routing';
import { decode } from 'src/app/utilities';

import { SafeHtml } from '@angular/platform-browser';

import { MarkupService } from 'src/app/services/markup.service';

import { ClassProperties } from 'src/app/types/class-properties';
import { PageUrl } from 'src/app/types/page-url';

const api = apiDecorator<ForumPostApi>();

type ForumPostArgs = Omit<
  ForumPost,
  | 'categoryUrl'
  | 'contentPreview'
  | 'contentText'
  | 'safeHtml'
  | 'titlePreview'
  | 'url'
>;

export type ForumPostCreate = Omit<
  ForumPostArgs,
  'createdAt' | 'flagsCount' | 'id' | 'likesCount'
>;

export class ForumPost {
  public constructor(
    props: ClassProperties<ForumPostArgs>,
    private readonly markup: MarkupService,
  ) {
    this.authorId = props.authorId;
    this.authorName = props.authorName;
    this.category = props.category;
    this.contentHtml = props.contentHtml;
    this.createdAt = props.createdAt;
    this.flagsCount = props.flagsCount;
    this.id = props.id;
    this.isSpoiler = props.isSpoiler;
    this.likesCount = props.likesCount;
    this.title = props.title;

    const forumCategoryUrl: PageUrl = 'forum/category/:id';
    const postUrl: PageUrl = 'forum/post/:id';

    this.contentText = this.markup.getTextFrom(this.contentHtml);
    this.contentPreview =
      this.contentText.length > 200
        ? this.contentText.slice(0, 200) + '…'
        : this.contentText;
    this.safeHtml = this.markup.toSafeHtml(props.contentHtml);

    this.categoryUrl =
      '/' + forumCategoryUrl.replace(':id', CATEGORY_TO_SLUG[this.category]);
    this.titlePreview =
      this.title.length > 80 ? `${this.title.slice(0, 80)}...` : this.title;
    this.url = '/' + postUrl.replace(':id', this.id);
  }

  public static readonly Codec = io.type({
    authorId: io.string,
    authorName: io.string,
    category: io.union([
      io.literal(ForumCategoryEnum.ANNOUNCEMENTS),
      io.literal(ForumCategoryEnum.COSPLAY),
      io.literal(ForumCategoryEnum.GENERAL),
      io.literal(ForumCategoryEnum.PIP_2000_MK_VI),
      io.literal(ForumCategoryEnum.PIP_3000),
      io.literal(ForumCategoryEnum.PIP_3000A),
      io.literal(ForumCategoryEnum.PIP_3000_MK_IV),
      io.literal(ForumCategoryEnum.PIP_3000_MK_V),
    ]),
    contentHtml: io.string,
    createdAt: io.type({ nanoseconds: io.number, seconds: io.number }),
    flagsCount: io.number,
    id: io.string,
    isSpoiler: io.boolean,
    likesCount: io.number,
    title: io.string,
  });

  /** UID of the user who created the post. */
  @api({ key: 'authorId' }) public readonly authorId: string;
  /** Display name (or email) of the author. */
  @api({ key: 'authorName' }) public readonly authorName: string;
  /** The category of the forum post. */
  @api({ key: 'category' }) public readonly category: ForumCategoryEnum;
  /** The main body content of the forum post. */
  @api({ key: 'contentHtml' }) public readonly contentHtml: string;
  /** Creation timestamp – converted to a Luxon DateTime. */
  @api({ key: 'createdAt' }) public readonly createdAt: DateTime;
  /** Number of times this post has been flagged. */
  @api({ key: 'flagsCount' }) public readonly flagsCount: number;
  /** Firestore document identifier for this post. */
  @api({ key: 'id' }) public readonly id: string;
  /** Whether this post is a spoiler. */
  @api({ key: 'isSpoiler' }) public readonly isSpoiler: boolean;
  /** Number of likes this post has received. */
  @api({ key: 'likesCount' }) public readonly likesCount: number;
  /** The title of the forum post. */
  @api({ key: 'title' }) public readonly title: string;

  /** Link to view this posts category in the forum. */
  public readonly categoryUrl: string;
  /** Preview of the content as text (not HTML), truncated to 100 characters. */
  public readonly contentPreview: string;
  /** The content as plain text, with all HTML tags removed. */
  public readonly contentText: string;
  /** The content as sanitized SafeHtml for [innerHTML]. */
  public readonly safeHtml: SafeHtml;
  /** Preview of the title, truncated to 250 characters. */
  public readonly titlePreview: string;
  /** Link to view this post in the forum. */
  public readonly url: string;

  public static deserialize(
    value: unknown,
    args: ForumPostDeserializeArgs,
  ): ForumPost {
    const decoded = decode(ForumPost.Codec, value);
    const createdAtDate = new Timestamp(
      decoded.createdAt.seconds,
      decoded.createdAt.nanoseconds,
    ).toDate();

    return new ForumPost(
      {
        authorId: decoded.authorId,
        authorName: decoded.authorName,
        category: decoded.category,
        contentHtml: decoded.contentHtml,
        createdAt: DateTime.fromJSDate(createdAtDate),
        flagsCount: decoded.flagsCount,
        id: decoded.id,
        isSpoiler: decoded.isSpoiler,
        likesCount: decoded.likesCount,
        title: decoded.title,
      },
      args.markupService,
    );
  }

  public static deserializeList(
    values: unknown[],
    args: ForumPostDeserializeArgs,
  ): readonly ForumPost[] {
    if (Array.isArray(values) === false) {
      throw new Error('Expected an array to deserialize a list of ForumPost');
    }
    return values.map((value) => ForumPost.deserialize(value, args));
  }

  public static serialize(
    value: ForumPostCreate,
    args: ForumPostSerializeArgs,
  ): ForumPostCreateApi {
    const clean = args.markupService.sanitizeForStorage(value.contentHtml);
    return {
      authorId: value.authorId,
      authorName: value.authorName,
      category: value.category,
      contentHtml: clean,
      createdAt: serverTimestamp(),
      // New posts start with zero flags. Checked by backend too on create.
      flagsCount: 0,
      // New posts start with zero likes. Checked by backend too on create.
      likesCount: 0,
      isSpoiler: value.isSpoiler,
      title: value.title,
    };
  }
}

export interface ForumPostDeserializeArgs {
  markupService: MarkupService;
}

export interface ForumPostSerializeArgs {
  markupService: MarkupService;
}
