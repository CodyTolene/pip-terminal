export interface HealthCheckApi {
  status: 'ok' | 'degraded' | 'down' | 'partial';
  timestamp: number; // Date.now()
}
