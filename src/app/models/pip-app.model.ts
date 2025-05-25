import * as io from 'io-ts';
import { apiDecorator } from 'src/app/decorators';
import { PipAppTypeEnum } from 'src/app/enums';
import { decode } from 'src/app/utilities';

type PipAppBaseApi = io.TypeOf<typeof PipAppBase.BaseCodec>;
const baseApi = apiDecorator<PipAppBaseApi>();

type PipAppApi = io.TypeOf<typeof PipApp.Codec>;
const api = apiDecorator<PipAppApi>();

export class PipAppBase {
  public constructor(args: PipAppBaseApi) {
    this.id = args.id;
    this.name = args.name;
    this.version = args.version;
  }

  public static readonly BaseCodec = io.type(
    {
      id: io.string,
      name: io.string,
      version: io.string,
    },
    'PipAppBaseApi',
  );

  @baseApi({ key: 'id' }) public readonly id: string;
  @baseApi({ key: 'name' }) public readonly name: string;
  @baseApi({ key: 'version' }) public readonly version: string;

  public static deserialize(value: unknown): PipAppBase {
    const decoded = decode(PipAppBase.BaseCodec, value);
    return new PipAppBase({
      id: decoded.id,
      name: decoded.name,
      version: decoded.version,
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
      version: this.version,
    };
  }
}

export class PipApp extends PipAppBase {
  public constructor(args: PipAppApi) {
    super(args);

    this.authors = args.authors;
    this.controls = args.controls;
    this.description = args.description;
    // this.id = args.id; // In PipAppBase
    this.instructions = args.instructions;
    this.isBootloaderRequired = args.isBootloaderRequired;
    // this.name = args.name; // In PipAppBase
    this.tip = args.tip;
    this.type = args.type;
    // this.version = args.version; // In PipAppBase
    this.zip = args.zip;
  }

  public static readonly Codec = io.type(
    {
      authors: io.readonlyArray(io.string),
      controls: io.string,
      description: io.string,
      id: io.string,
      instructions: io.string,
      isBootloaderRequired: io.boolean,
      name: io.string,
      tip: io.union([io.undefined, io.string]),
      type: io.union([
        io.literal(PipAppTypeEnum.APP),
        io.literal(PipAppTypeEnum.GAME),
      ]),
      version: io.string,
      zip: io.string,
    },
    'PipAppApi',
  );

  @api({ key: 'authors' }) public readonly authors: readonly string[];
  @api({ key: 'controls' }) public readonly controls: string;
  @api({ key: 'description' }) public readonly description: string;
  @api({ key: 'instructions' }) public readonly instructions: string;
  @api({ key: 'isBootloaderRequired' })
  public readonly isBootloaderRequired: boolean;
  @api({ key: 'tip' }) public readonly tip?: string;
  @api({ key: 'type' }) public readonly type: PipAppTypeEnum;
  @api({ key: 'zip' }) public readonly zip: string;

  public static override deserialize(value: unknown): PipApp {
    const decoded = decode(PipApp.Codec, value);
    return new PipApp({
      authors: decoded.authors,
      controls: decoded.controls,
      description: decoded.description,
      id: decoded.id,
      instructions: decoded.instructions,
      isBootloaderRequired: decoded.isBootloaderRequired,
      name: decoded.name,
      tip: decoded.tip,
      type: decoded.type,
      version: decoded.version,
      zip: decoded.zip,
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
      authors: this.authors,
      controls: this.controls,
      description: this.description,
      id: this.id,
      instructions: this.instructions,
      isBootloaderRequired: this.isBootloaderRequired,
      name: this.name,
      tip: this.tip,
      type: this.type,
      version: this.version,
      zip: this.zip,
    };
  }
}
