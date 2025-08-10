import { MonoTypeOperatorFunction, shareReplay } from 'rxjs';

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
