import { Primitive } from '@angular/fire/firestore';

/**
 * All first-level deep keys of an object of type <T>.
 */
export type KeysOf<T> = { [P in keyof T]: P }[keyof T];

/**
 * All first level deep keys of an object of type <T> that are of type <string>
 * __only__.
 */
export type KeysOfString<T> = Extract<KeysOf<T>, string>;

/**
 * Returns __all__ keys & nested keys of an object of type <T> that are of type
 * <string> __only__.
 */
export type NestedKeysOfString<T> = T extends Primitive
  ? never
  : T extends null | undefined
    ? ''
    :
        | KeysOfString<T>
        | {
            [P in keyof T & string]: `${P}.${NestedKeysOfString<
              NonNullable<T[P]>
            >}`;
          }[keyof T & string];

export type DeepNestedKeysOfString<T, P extends keyof T & string> =
  T[P] extends Array<infer Inner>
    ? `${P}.${NestedKeysOfString<Inner>}`
    : T[P] extends object
      ? `${P}.${NestedKeysOfString<T[P]>}`
      : never;
