// Interface definition for a forum post.  A post can have a title,
// body, tags and an array of comments.  It also includes fields to
// track flags raised by users.  If a user flags a post once, they
// cannot flag it again.  The `flagCount` keeps track of the total
// number of times a post has been flagged.
import { Comment } from './comment.model';

export interface Post {
  /**
   * Unique identifier for the post.
   */
  id: string;

  /**
   * Title of the post.
   */
  title: string;

  /**
   * Body/content of the post.
   */
  body: string;

  /**
   * Tags or categories associated with the post.
   */
  tags?: string[];

  /**
   * Array of comments that belong to this post.  Each comment is
   * represented by the `Comment` interface defined in
   * `comment.model.ts`.
   */
  comments?: Comment[];

  /**
   * Total number of times this post has been flagged by users.  This
   * value is incremented whenever a user flags the post.
   */
  flagCount?: number;

  /**
   * Indicates whether the currently logged‑in user has flagged this
   * post.  Used to disable the flag button after a user has flagged
   * the post once.
   */
  flaggedByCurrentUser?: boolean;
}
