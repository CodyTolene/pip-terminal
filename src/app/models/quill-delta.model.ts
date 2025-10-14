import { ForumPostApi } from 'api/src/models';
import * as io from 'io-ts';
import Delta, { Op } from 'quill-delta';
import { apiDecorator } from 'src/app/decorators';

import { QuillDeltaOp } from 'src/app/models/quill-delta-op.model';

import { ClassProperties } from 'src/app/types/class-properties';

const api = apiDecorator<ForumPostApi<Delta>['contentDelta']>();

/**
 * A class representing a Quill Delta, which is a data structure used to describe
 * rich text content and its formatting.
 */
export class QuillDelta {
  public constructor(props: ClassProperties<QuillDelta>) {
    this.ops = props.ops;
  }

  public static readonly Codec = io.type({
    ops: io.array(QuillDeltaOp.Codec),
  });

  @api({ key: 'ops' }) public readonly ops: readonly Op[];
}
