import { CloudEventV1 } from 'cloudevents';
import * as Zlib from 'zlib';


export function featurehubCloudEventBodyParser<T>(event: CloudEventV1<any>): T {
  let data: T = undefined;

  if (event.datacontenttype === 'application/json') {
    if (typeof event.data == 'string') {
      data = JSON.parse(event.data) as T;
    } else if (event.data instanceof String) {
      data = JSON.parse(event.data.toString()) as T;
    } else {
      data = event.data as T;
    }
  } else if (event.datacontenttype === 'application/json+gzip') {
    if (event.data !== undefined) {
      if (event.data instanceof Buffer) {
        const result = Zlib.inflateSync(event.data).toString();
        data = JSON.parse(result) as T;
      } else if (typeof event.data == 'string') {
        data = JSON.parse(Zlib.inflateSync(Buffer.from(event.data)).toString()) as T;
      }

    }
  }

  return data;
}