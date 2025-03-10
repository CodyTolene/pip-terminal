import { isNonEmptyValue } from './type.util';

/**
 * Retrieves an enum member from the given value. Falls back to a default if
 * provided. Throws an error if both the value and default are invalid.
 */
export function getEnumMember<T extends Record<string, string | number>>(
  enumObject: T,
  value?: string | number | null,
  defaultValue?: T[keyof T] | null,
): T[keyof T] | null {
  if (isNonEmptyValue(value) && isEnumMember(enumObject, value)) {
    return value as T[keyof T];
  }

  if (isNonEmptyValue(defaultValue) && isEnumMember(enumObject, defaultValue)) {
    return defaultValue;
  }

  console.warn(`Invalid values "${value}".`);

  return null;
}

/**
 * Retrieves an array of all values from an enum.
 */
export function getEnumValues<T extends Record<string, string | number>>(
  enumObject: T,
): Array<T[keyof T]> {
  return Object.values(enumObject) as Array<T[keyof T]>;
}

/**
 * Checks if a value is a valid member of the given enum.
 */
function isEnumMember<T extends Record<string, string | number>>(
  enumObject: T,
  value: unknown,
): value is T[keyof T] {
  return getEnumValues(enumObject).includes(value as T[keyof T]);
}
