import { HealthCheckApi } from 'api/src/models';
import { Observable, catchError, map, of } from 'rxjs';
import { HealthCheck } from 'src/app/models';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class StatusService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  /**
   * Performs a health check against the API.
   *
   * @returns A health check object or undefined on failure.
   */
  public get(): Observable<HealthCheck | undefined> {
    const url = `${this.baseUrl}/health-check`;
    return this.http.get<HealthCheckApi>(url).pipe(
      map((response) => HealthCheck.deserialize(response)),
      catchError((err) => {
        console.error('Health check failed', err);
        return of(undefined);
      }),
    );
  }
}
