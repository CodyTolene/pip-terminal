import { HealthCheckApi } from 'api/src/models';
import * as io from 'io-ts';
import { DateTime } from 'luxon';
import { apiDecorator } from 'src/app/decorators';
import { decode } from 'src/app/utilities';

// type HealthCheckApi = io.TypeOf<typeof HealthCheck.Codec>;
const api = apiDecorator<HealthCheckApi>();

export class HealthCheck {
  public constructor(props: ClassProperties<HealthCheck>) {
    this.status = props.status;
    this.timestamp = props.timestamp;
  }

  public static readonly Codec = io.type({
    status: io.literal('ok'),
    timestamp: io.number, // Date.now()
  });

  @api({ key: 'status' }) public readonly status: 'ok';
  @api({ key: 'timestamp' }) public readonly timestamp: DateTime;

  public static deserialize(value: unknown): HealthCheck {
    const decoded = decode(HealthCheck.Codec, value);
    return new HealthCheck({
      status: decoded.status,
      timestamp: DateTime.fromMillis(decoded.timestamp),
    });
  }
}
