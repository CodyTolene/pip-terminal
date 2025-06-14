import { Observable, catchError, map, of } from 'rxjs';
import { PipApp } from 'src/app/models';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service for managing Pip Apps, including fetching the registry and
 * individual app assets.
 */
@Injectable()
export class PipAppsService {
  public constructor(
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
  ) {}

  /**
   * Fetches the registry of Pip Apps from the server.
   *
   * @returns An observable that emits the registry of apps or undefined if the
   * request fails.
   */
  public fetchRegistry(): Observable<readonly PipApp[] | undefined> {
    const registryUrl = `${environment.appsUrl}/registry.json`;
    return this.http.get<readonly PipApp[] | undefined>(registryUrl).pipe(
      map((response) => {
        if (!response) {
          throw new Error('No response from API');
        }
        return PipApp.deserializeList(response);
      }),
      catchError(
        this.handleError<readonly PipApp[] | undefined>(
          'fetchRegistry',
          undefined,
        ),
      ),
    );
  }

  /**
   * Fetches a ZIP file from the server as a Blob.
   *
   * @param url The URL of the ZIP file to fetch.
   * @returns An observable that emits the ZIP file as a Blob or null if the request fails.
   */
  public fetchZipFile(zipName: string): Observable<Blob | null> {
    const zipUrl = `${environment.appsUrl}/${zipName}`;
    return this.http.get(zipUrl, { responseType: 'blob' }).pipe(
      map((response) => {
        if (response instanceof Blob) {
          return response;
        }
        throw new Error('Response is not a Blob');
      }),
      catchError(this.handleError<Blob | null>('fetchZipFile', null)),
    );
  }

  private handleError<T>(context: string, fallbackValue: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${context} failed:`, error);

      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 404: {
            this.snackBar.open('File not found.', 'OK', { duration: 3000 });
            break;
          }
          case 403: {
            this.snackBar.open(
              'Access denied or GitHub rate limit exceeded.',
              'OK',
              { duration: 4000 },
            );
            break;
          }
          case 500:
          case 503: {
            this.snackBar.open(
              'GitHub is experiencing issues. Try again later.',
              'OK',
              { duration: 4000 },
            );
            break;
          }
          case 0: {
            this.snackBar.open(
              'Network error. Check your internet connection.',
              'OK',
              { duration: 4000 },
            );
            break;
          }
          case 429: {
            this.snackBar.open(
              'Too many requests. Wait a minute and try again.',
              'OK',
              { duration: 4000 },
            );
            break;
          }
          default: {
            this.snackBar.open(
              'An unknown error occurred. Please try again later.',
              'OK',
              { duration: 4000 },
            );
            break;
          }
        }
      }

      return of(fallbackValue);
    };
  }
}
