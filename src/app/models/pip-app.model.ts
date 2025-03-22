import * as io from 'io-ts';
import { apiDecorator } from 'src/app/decorators';
import { decode } from 'src/app/utilities';

type PipAppApi = io.TypeOf<typeof PipApp.Codec>;

const api = apiDecorator<PipAppApi>();

export class PipApp {
  public constructor(args: ClassProperties<PipAppApi>) {
    this.author = args.author;
    this.description = args.description;
    this.homepage = args.homepage;
    this.id = args.id;
    this.instructions = args.instructions;
    this.name = args.name;
    this.tip = args.tip;
    this.version = args.version;

    // Temporary values
    const baseUrl =
      'https://raw.githubusercontent.com/CodyTolene/pip-apps/main/USER';

    // Computed values
    this.url = `${baseUrl}/${this.id}.js`;
  }

  public static readonly Codec = io.type(
    {
      author: io.string,
      description: io.string,
      homepage: io.union([io.undefined, io.string]),
      id: io.string,
      instructions: io.string,
      name: io.string,
      tip: io.union([io.undefined, io.string]),
      version: io.string,
    },
    'PipApp',
  );

  @api({ key: 'author' }) public readonly author: string;
  @api({ key: 'description' }) public readonly description: string;
  @api({ key: 'homepage' }) public readonly homepage?: string;
  @api({ key: 'id' }) public readonly id: string;
  @api({ key: 'instructions' }) public readonly instructions: string;
  @api({ key: 'name' }) public readonly name: string;
  @api({ key: 'tip' }) public readonly tip?: string;
  @api({ key: 'version' }) public readonly version: string;

  // Computed values
  public readonly url: string;

  public static deserialize(value: unknown): PipApp {
    const decoded = decode(PipApp.Codec, value);
    return new PipApp({
      author: decoded.author,
      description: decoded.description,
      homepage: decoded.homepage,
      id: decoded.id,
      instructions: decoded.instructions,
      name: decoded.name,
      tip: decoded.tip,
      version: decoded.version,
    });
  }

  public static deserializeList(values: readonly unknown[]): readonly PipApp[] {
    if (!Array.isArray(values)) {
      throw new Error('Expected array of PipApp objects.');
    }
    return values.map(PipApp.deserialize);
  }
}
