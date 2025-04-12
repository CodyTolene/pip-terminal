import * as io from 'io-ts';
import { apiDecorator } from 'src/app/decorators';
import { PipAppTypeEnum } from 'src/app/enums';
import { decode } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

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
      version: io.union([io.undefined, io.string]),
    },
    'PipAppBaseApi',
  );

  @baseApi({ key: 'id' }) public readonly id: string;
  @baseApi({ key: 'name' }) public readonly name: string;
  @baseApi({ key: 'version' }) public readonly version?: string;

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
    this.description = args.description;
    this.files = args.files.map((file) => {
      const fileUrl = `${environment.appsUrl}/${file}`;
      return {
        name: file,
        url: fileUrl,
      };
    });
    this.homepage = args.homepage;
    this.instructions = args.instructions;
    this.tip = args.tip;
    this.type = args.type;
    this.version = args.version;

    // Computed values
    this.isBootloaderRequired = args.files?.some((file) =>
      file.startsWith('USER_BOOT'),
    );
  }

  public static readonly Codec = io.type(
    {
      authors: io.readonlyArray(io.string),
      description: io.string,
      files: io.readonlyArray(io.string),
      homepage: io.union([io.undefined, io.string]),
      id: io.string,
      instructions: io.string,
      name: io.string,
      tip: io.union([io.undefined, io.string]),
      type: io.union([
        io.literal(PipAppTypeEnum.APP),
        io.literal(PipAppTypeEnum.GAME),
      ]),
      version: io.string,
    },
    'PipAppApi',
  );

  @api({ key: 'authors' }) public readonly authors: readonly string[];
  @api({ key: 'description' }) public readonly description: string;
  @api({ key: 'files' }) public readonly files: ReadonlyArray<{
    name: string;
    url: string;
  }>;
  @api({ key: 'homepage' }) public readonly homepage?: string;
  @api({ key: 'instructions' }) public readonly instructions: string;
  @api({ key: 'tip' }) public readonly tip?: string;
  @api({ key: 'type' }) public readonly type: PipAppTypeEnum;
  @api({ key: 'version' }) public override readonly version: string;

  // Computed values
  public readonly isBootloaderRequired: boolean;

  public static override deserialize(value: unknown): PipApp {
    const decoded = decode(PipApp.Codec, value);
    return new PipApp({
      authors: decoded.authors,
      description: decoded.description,
      files: decoded.files,
      homepage: decoded.homepage,
      id: decoded.id,
      instructions: decoded.instructions,
      name: decoded.name,
      tip: decoded.tip,
      type: decoded.type,
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
      authors: this.authors,
      description: this.description,
      files: this.files.map((file) => file.name),
      homepage: this.homepage,
      id: this.id,
      instructions: this.instructions,
      name: this.name,
      tip: this.tip,
      type: this.type,
      version: this.version,
    };
  }
}
