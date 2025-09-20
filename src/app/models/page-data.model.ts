import * as io from 'io-ts';
import { PageLayoutsEnum } from 'src/app/enums';

import { Data } from '@angular/router';

import { ClassProperties } from 'src/app/types/class-properties';
import { PageName } from 'src/app/types/page-name';

export class PageData implements Data {
  public constructor(props: ClassProperties<PageData>) {
    this.author = props['author'];
    this.description = props['description'];
    this.keywords = props['keywords'];
    this.layout = props['layout'];
    this.title = props['title'];
  }

  public static readonly Codec = io.type(
    {
      author: io.string,
      description: io.string,
      keywords: io.readonlyArray(io.string),
      layout: io.union([
        io.literal(PageLayoutsEnum.NONE),
        io.literal(PageLayoutsEnum.PIP_2000_MK_VI),
        io.literal(PageLayoutsEnum.PIP_3000),
        io.literal(PageLayoutsEnum.PIP_3000A),
        io.literal(PageLayoutsEnum.PIP_3000_MK_IV),
      ]),
      title: io.string,
    },
    'PipAppApi',
  );

  public readonly author: string;
  public readonly description: string;
  public readonly keywords: readonly string[];
  public readonly layout: PageLayoutsEnum;
  public readonly title: PageName;

  public static is(value: unknown): value is PageData {
    return PageData.Codec.is(value);
  }
}
