import { DateTime } from 'luxon';

import { Injectable } from '@angular/core';

// |----------------------|
// |  (λ)  | localStorage |
// |-------|--------------|
// | Size  | 5 MB         |
// | Life  | Until Delete |
// |----------------------|

/** A service to store and retrieve data from localStorage. */
@Injectable({ providedIn: 'root' })
export class StorageLocalService {
  /** Clear all data from localStorage. */
  public clear(): void {
    localStorage.clear();
  }

  /**
   * Retrieve a value from the specified storage type.
   *
   * @param key The key to retrieve.
   * @returns The stored value, or `null` if not found or expired.
   */
  public get<T>(key: string): T | null {
    const storedData = localStorage.getItem(key);

    if (!storedData) {
      return null;
    }

    try {
      const jsonObject: StoredObject<T> = JSON.parse(storedData);
      if (
        jsonObject.expiration &&
        DateTime.fromISO(jsonObject.expiration) < DateTime.local()
      ) {
        localStorage.removeItem(key); // Remove expired items
        return null;
      }
      return jsonObject.value;
    } catch (error) {
      console.error(`Failed to parse stored data for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Store a value in the specified storage type.
   *
   * @param key The key to store the value under.
   * @param value The value to store. Use `null` to remove the key.
   * @param expiration Optional expiration date.
   */
  public set<T>(key: string, value: T | null, expiration?: DateTime): void {
    if (value === null) {
      localStorage.removeItem(key);
      return;
    }

    const objToStore: StoredObject<T> = {
      value,
      expiration: expiration?.toISO() ?? null,
    };

    const json = JSON.stringify(objToStore);
    const storageUsed = JSON.stringify(localStorage).length;
    const storageLimit = 5 * 1024 * 1024; // 5 MB

    if (storageUsed + json.length > storageLimit) {
      throw new Error('localStorage size limit exceeded.');
    }

    localStorage.setItem(key, json);
  }
}
