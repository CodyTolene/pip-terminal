import * as io from 'io-ts';

import { Data } from '@angular/router';

import { ClassProperties } from 'src/app/types/class-properties';
import { PageName } from 'src/app/types/page-name';

export class PageData implements Data {
  public constructor(props: ClassProperties<PageData>) {
    this.author = props['author'];
    this.description = props['description'];
    this.keywords = props['keywords'];
    this.title = props['title'];
  }

  public static readonly Codec = io.type(
    {
      author: io.string,
      description: io.string,
      keywords: io.readonlyArray(io.string),
      title: io.string,
    },
    'PipAppApi',
  );

  public readonly author: string;
  public readonly description: string;
  public readonly keywords: readonly string[];
  public readonly title: PageName;

  public static is(value: unknown): value is PageData {
    return PageData.Codec.is(value);
  }
}
