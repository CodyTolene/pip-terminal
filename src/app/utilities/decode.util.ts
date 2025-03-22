import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as io from 'io-ts';
import { failure } from 'io-ts/PathReporter';

/**
 * Decodes an input using the provided io-ts codec.
 *
 * @param codec The io-ts codec to use for decoding.
 * @param input The input to decode.
 * @param strict Whether to throw an error if decoding fails.
 * @returns The decoded value, or null if decoding fails and strict is false.
 */
export function decode<A, O = A, I = unknown>(
  codec: io.Type<A, O, I>,
  input: I,
  strict: true,
): A;
export function decode<A, O = A, I = unknown>(
  codec: io.Type<A, O, I>,
  input: I,
  strict: false,
): A | null;
export function decode<A, O = A, I = unknown>(
  codec: io.Type<A, O, I>,
  input: I,
  strict?: boolean,
): A;
export function decode<A, O = A, I = unknown>(
  codec: io.Type<A, O, I>,
  input: I,
  strict = true,
): A | null {
  if (!strict && input === null) {
    return null;
  }
  return pipe(
    codec.decode(input),
    E.getOrElseW((errors) => {
      const message =
        `Failed to deserialize data:\n` + failure(errors).join('\n\n');
      if (strict) {
        throw new Error(message);
      } else {
        console.warn(message);
        return null;
      }
    }),
  );
}
