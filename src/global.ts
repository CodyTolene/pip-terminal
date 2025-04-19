/** To be used with `public/scripts/uart.js`. */

export interface EspruinoConnection {
  close(): Promise<void>;
  emit(
    event: 'open' | 'close' | 'data' | 'error' | 'ack' | 'nak' | 'packet',
    ...args: unknown[]
  ): void;
  espruinoEval<R>(expr: string, options?: EspruinoEvalOptions): Promise<R>;
  espruinoReceiveFile(
    filename: string,
    options?: EspruinoFileOptions,
  ): Promise<string>;
  espruinoSendPacket(
    type: string,
    data: string,
    options?: EspruinoPacketOptions,
  ): Promise<void>;
  espruinoSendFile(
    filename: string,
    data: string,
    options?: EspruinoFileOptions,
  ): Promise<void>;
  hadData: boolean;
  isOpen: boolean;
  isOpening: boolean;
  on(
    event: 'open' | 'close' | 'data' | 'error' | 'ack' | 'nak' | 'packet',
    callback: (...args: unknown[]) => void,
  ): void;
  parsePackets: boolean;
  received: string;
  removeListener(
    event: 'open' | 'close' | 'data' | 'error' | 'ack' | 'nak' | 'packet',
    callback: (...args: unknown[]) => void,
  ): void;
  rxDataHandler(data: string): void;
  txInProgress: boolean;
  write(
    data: string,
    callback?: () => void,
    alreadyRetried?: boolean,
  ): Promise<void>;
}

export interface EspruinoPacketOptions {
  noACK?: boolean;
}

export interface EspruinoFileOptions {
  chunkSize?: number;
  fs?: boolean;
  noACK?: boolean;
  progress?: (chunkNo: number, chunkCount: number) => void;
  timeout?: number;
}

export interface EspruinoEvalOptions {
  stmFix?: boolean;
  timeout?: number;
}

export interface UartStatic {
  baud: number;
  close(): void;
  connect(
    callback: (connection: EspruinoConnection | null) => void,
    options?: UartConnectionOptions,
  ): EspruinoConnection;
  connectAsync(options?: UartConnectionOptions): Promise<EspruinoConnection>;
  debug: number;
  endpoints: UartEndpoint[];
  eval(
    expression: string,
    callback?: (result: unknown, status?: string) => void,
  ): Promise<unknown>;
  flowControl: boolean;
  getConnection(): EspruinoConnection | undefined;
  getConnectionAsync(): Promise<EspruinoConnection>;
  isConnected(): boolean;
  log(level: number, message: string): void;
  modal(callback: () => void): void;
  optionsBluetooth: Record<string, unknown>;
  optionsSerial: Record<string, unknown>;
  ports: string[];
  setTime(callback?: () => void): void;
  version: string;
  write(
    data: string,
    callback?: (data: string) => void,
    callbackNewline?: boolean,
  ): Promise<string>;
  writeProgress(charsSent?: number, charsTotal?: number): void;
}

export interface UartEndpoint {
  connect(
    connection: EspruinoConnection,
    options?: UartConnectionOptions,
  ): Promise<EspruinoConnection>;
  description: string;
  isSupported(): true | string;
  name: string;
  svg: string;
}

export interface UartConnectionOptions {
  serialPort?: unknown;
}

declare global {
  const UART: UartStatic;

  interface Window {
    ['ga-disable-G-XXXXXXXXXX']?: boolean;
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
