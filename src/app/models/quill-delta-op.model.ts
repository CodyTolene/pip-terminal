import { ForumPostApi } from 'api/src/models';
import * as io from 'io-ts';
import Delta, { Op } from 'quill-delta';
import { apiDecorator } from 'src/app/decorators';

import { ClassProperties } from 'src/app/types/class-properties';

const api = apiDecorator<ForumPostApi<Delta>['contentDelta']['ops']>();

/**
 * A class representing a single operation in a Quill Delta.
 *
 * @see `quill-delta\dist\Op.d.ts`
 */
export class QuillDeltaOp {
  public constructor(props: ClassProperties<QuillDeltaOp>) {
    this.attributes = props.attributes;
    this.delete = props.delete;
    this.insert = props.insert;
    this.retain = props.retain;
  }

  public static readonly Codec = io.type({
    attributes: io.union([io.record(io.string, io.unknown), io.undefined]),
    delete: io.union([io.number, io.undefined]),
    insert: io.union([
      io.string,
      io.record(io.string, io.unknown),
      io.undefined,
    ]),
    retain: io.union([
      io.number,
      io.record(io.string, io.unknown),
      io.undefined,
    ]),
  });

  @api({ key: 'attributes' }) public readonly attributes:
    | Op['attributes']
    | undefined;
  @api({ key: 'delete' }) public readonly delete: Op['delete'] | undefined;
  @api({ key: 'insert' }) public readonly insert: Op['insert'] | undefined;
  @api({ key: 'retain' }) public readonly retain: Op['retain'] | undefined;
}
