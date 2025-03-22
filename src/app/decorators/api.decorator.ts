import 'reflect-metadata';

/**
 * A decorator for properties that are mapped to an API model.
 *
 * @returns The property decorator.
 */
export function apiDecorator<T>(): ApiDecorator<T> {
  return (apiKey: ApiKey<T>) =>
    (target: object, propertyKey: string): void => {
      Reflect.defineMetadata(
        Symbol('API Key'),
        apiKey?.key,
        target,
        propertyKey,
      );
    };
}

type ApiDecorator<T> = (
  apiKey: ApiKey<T>,
) => (target: object, propertyKey: string) => void;

interface ApiKey<T> {
  key: KeysOf<T>;
}
