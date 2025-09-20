/** Interface for stored objects with optional expiration. */
export interface StoredObject<T> {
  value: T;
  expiration: string | null;
}
