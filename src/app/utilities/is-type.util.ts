function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0 && value.trim().length > 0;
}

export function isNonEmptyValue<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isStringArray(values: unknown[]): values is string[] {
  return (
    Array.isArray(values) && values.every((value) => typeof value === 'string')
  );
}

export function isNonEmptyObject<T>(value: T): value is NonNullable<T> {
  return isNonEmptyValue(value) && Object.keys(value).length > 0;
}
