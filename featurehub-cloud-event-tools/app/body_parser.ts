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
        const result = Zlib.gunzipSync(event.data).toString();
        data = JSON.parse(result) as T;
      } else if (typeof event.data == 'string') {
        data = JSON.parse(Zlib.gunzipSync(Buffer.from(event.data)).toString()) as T;
      }

    }
  }

  return data;
}

export function featureHubBodyParser(logger: any) {
  return function (req: any, res: any, next: any) {
    if (req.contentType() === 'application/json') {
      let data = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk: any) {
        data += chunk;
      });

      req.on('end', function () {
        logger?.debug(`'------------------------------\\nbody was ${data}\n---------------------------'`);
        req.body = JSON.parse(data);
        next();
      });
    } else if (req.contentType() === 'application/json+gzip') {
      let data = Buffer.from([]);

      req.on('data', function (chunk: any) {
        data = Buffer.concat([data, Buffer.from(chunk)]);
      });

      req.on('end', function () {
        req.body = data;
        next();
      });
    } else {
      next();
    }
  };
}
