/** Interface for stored objects with optional expiration. */
interface StoredObject<T> {
  value: T;
  expiration: string | null;
}
