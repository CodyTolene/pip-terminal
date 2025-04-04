import { Observable, catchError, map, of } from 'rxjs';
import { PipApp } from 'src/app/models';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Service for managing Pip Apps, including fetching the registry and
 * individual app assets.
 */
@Injectable()
export class PipAppsService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Fetches the registry of Pip Apps from the server.
   *
   * @returns An observable that emits the registry of apps or undefined if the
   * request fails.
   */
  public fetchRegistry(): Observable<readonly PipApp[] | undefined> {
    const registryUrl = `${environment.appsUrl}/${environment.appsDir}/_registry.json`;
    return this.http.get<readonly PipApp[] | undefined>(registryUrl).pipe(
      map((response) => {
        if (!response) {
          throw new Error('No response from API');
        }
        return PipApp.deserializeList(response);
      }),
      catchError((error: unknown) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  /**
   * Fetches a Pip App asset (i.e. JS file) from the server as a string.
   *
   * @param url The URL of the asset to fetch.
   * @returns An observable that emits the asset as a string or null if the
   * request fails.
   */
  public fetchAsset(url: string): Observable<string | null> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((scriptText) => (scriptText?.trim() ? scriptText : null)),
      catchError((error: unknown) => {
        console.error('Failed to load app script:', error);
        return of(null);
      }),
    );
  }
}
