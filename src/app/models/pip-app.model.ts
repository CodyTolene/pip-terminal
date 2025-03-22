import * as io from 'io-ts';
import { apiDecorator } from 'src/app/decorators';
import { decode } from 'src/app/utilities';

type PipAppBaseApi = io.TypeOf<typeof PipAppBase.BaseCodec>;
const baseApi = apiDecorator<PipAppBaseApi>();

type PipAppApi = io.TypeOf<typeof PipApp.Codec>;
const api = apiDecorator<PipAppApi>();

export class PipAppBase {
  public constructor(args: PipAppBaseApi) {
    this.id = args.id;
    this.name = args.name;
  }

  public static readonly BaseCodec = io.type(
    {
      id: io.string,
      name: io.string,
    },
    'PipAppBaseApi',
  );

  @baseApi({ key: 'id' }) public readonly id: string;
  @baseApi({ key: 'name' }) public readonly name: string;

  public static deserialize(value: unknown): PipAppBase {
    const decoded = decode(PipAppBase.BaseCodec, value);
    return new PipAppBase({
      id: decoded.id,
      name: decoded.name,
    });
  }

  public static deserializeList(
    values: readonly unknown[],
  ): readonly PipAppBase[] {
    if (!Array.isArray(values)) {
      throw new Error('Expected array of PipAppBase objects.');
    }
    return values.map(PipAppBase.deserialize);
  }

  public serialize(): PipAppBaseApi {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export class PipApp extends PipAppBase {
  public constructor(args: PipAppApi) {
    super(args);

    this.author = args.author;
    this.description = args.description;
    this.homepage = args.homepage;
    this.instructions = args.instructions;
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
    'PipAppApi',
  );

  @api({ key: 'author' }) public readonly author: string;
  @api({ key: 'description' }) public readonly description: string;
  @api({ key: 'homepage' }) public readonly homepage?: string;
  @api({ key: 'instructions' }) public readonly instructions: string;
  @api({ key: 'tip' }) public readonly tip?: string;
  @api({ key: 'version' }) public readonly version: string;

  // Computed values
  public readonly url: string;

  public static override deserialize(value: unknown): PipApp {
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

  public static override deserializeList(
    values: readonly unknown[],
  ): readonly PipApp[] {
    if (!Array.isArray(values)) {
      throw new Error('Expected array of PipApp objects.');
    }
    return values.map(PipApp.deserialize);
  }

  public override serialize(): PipAppApi {
    return {
      author: this.author,
      description: this.description,
      homepage: this.homepage,
      id: this.id,
      instructions: this.instructions,
      name: this.name,
      tip: this.tip,
      version: this.version,
    };
  }
}
