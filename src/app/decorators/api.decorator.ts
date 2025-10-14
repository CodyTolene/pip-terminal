// Used to attach API key metadata to class properties.
import 'reflect-metadata';

import { KeysOf } from 'src/app/types/keys';

// Use a single, shared Symbol for the metadata key.
const API_KEY_META = Symbol('api:key');

// Helper type that unwraps array types to their element type.
type ElementOf<T> =
  T extends ReadonlyArray<infer U> ? U : T extends Array<infer U> ? U : T;

// The key that targets the element type.
interface ApiKey<T> {
  key: KeysOf<ElementOf<T>>;
}

// Property decorator factory type.
type ApiDecorator<T> = (
  apiKey: ApiKey<T>,
) => (target: object, propertyKey: string) => void;

/**
 * A decorator for properties that are mapped to an API model.
 *
 * @returns The property decorator.
 */
export function apiDecorator<T>(): ApiDecorator<T> {
  return (apiKey: ApiKey<T>) =>
    (target: object, propertyKey: string): void => {
      Reflect.defineMetadata(API_KEY_META, apiKey.key, target, propertyKey);
    };
}
