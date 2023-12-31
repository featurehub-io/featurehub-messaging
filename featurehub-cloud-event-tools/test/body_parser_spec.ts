import { CloudEvent } from 'cloudevents';
import { beforeEach } from 'mocha';
import { featurehubCloudEventBodyParser } from '../app/body_parser';
import { expect } from 'chai';
import * as ZLib from 'zlib';

describe('the parser should decode the data', () => {
  let ce: CloudEvent<any>;

  beforeEach(() => {
    ce = new CloudEvent<any>({ type: 'peas', source: 'http://featurehub', id: 'x', subject: 'maths' });
  });

  it('should not decode an unknown type', () => {
    const unknownDataContent = ce.cloneWith({ datacontenttype: 'unknown' });
    const result = featurehubCloudEventBodyParser(unknownDataContent);
    expect(result).to.be.undefined;
  });

  it('should decode string json data as object', () => {
    const jsonData = ce.cloneWith({ datacontenttype: 'application/json', data: '{"x":1}' });
    const result = featurehubCloudEventBodyParser<any>(jsonData);
    expect(result.x).to.eq(1);
  });

  it('should decode json data as is', () => {
    const jsonData = ce.cloneWith({ datacontenttype: 'application/json', data: { x: 1 } });
    const result = featurehubCloudEventBodyParser<any>(jsonData);
    expect(result.x).to.eq(1);
  });

  it('should decode gzipped json data', () => {
    const obj = JSON.stringify({ x: 2, y: 'zzz' });
    const zipped = ce.cloneWith({ datacontenttype: 'application/json+gzip', data: ZLib.deflateSync(obj) });
    const result = featurehubCloudEventBodyParser<any>(zipped);
    expect(result.x).to.eq(2);
    expect(result.y).to.eq('zzz');
  });
});