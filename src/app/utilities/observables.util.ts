import {
  MonoTypeOperatorFunction,
  Observable,
  filter,
  firstValueFrom,
  shareReplay,
} from 'rxjs';

import { isNonEmptyValue } from 'src/app/utilities/is-type.util';

/**
 * Returns an RxJS operator that shares a single subscription to the source observable
 * and replays the latest emitted value to new subscribers.
 *
 * This operator is useful for multicasting the most recent value to multiple subscribers,
 * ensuring that each subscriber receives the latest value upon subscription, and that
 * the source observable is only subscribed to once.
 *
 * @typeParam T - The type of items emitted by the source observable.
 * @returns A MonoTypeOperatorFunction that applies shareReplay with buffer size 1 and refCount enabled.
 */
export function shareSingleReplay<T>(): MonoTypeOperatorFunction<T> {
  return shareReplay<T>({ bufferSize: 1, refCount: true });
}

/**
 * This function retrieves the first non-empty value emitted by the provided observable.
 *
 * @param observable - The source observable to subscribe to.
 * @returns A promise that resolves with the first non-empty value emitted by the observable.
 */
export function getFirstNonEmptyValueFrom<T>(
  observable: Observable<T | null | undefined>,
): Promise<T> {
  return firstValueFrom(observable.pipe(filter(isNonEmptyValue)));
}
