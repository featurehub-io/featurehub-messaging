import {CloudEvent, CloudEventV1} from "cloudevents";
import {beforeEach} from "mocha";
import {body_parser} from "../app";
import {expect} from "chai";
import * as ZLib from "zlib";

describe('the parser should decode the data', () => {
  let ce: CloudEvent<any>;

  beforeEach(() => {
    ce = new CloudEvent<any>({ type: 'peas', source: 'http://featurehub', id: 'x', subject: 'maths' });
  });

  it('should not decode an unknown type', () => {
    const unknownDataContent = ce.cloneWith({datacontenttype: 'unknown'});
    const result = body_parser(unknownDataContent);
    expect(result).to.be.undefined;
  });

  it('should decode string json data as object', () => {
    const jsonData = ce.cloneWith({ datacontenttype: 'application/json', data: '{"x":1}'});
    const result = body_parser<any>(jsonData);
    expect(result.x).to.eq(1);
  });

  it('should decode json data as is', () => {
    const jsonData = ce.cloneWith({ datacontenttype: 'application/json', data: {x:1} });
    const result = body_parser<any>(jsonData);
    expect(result.x).to.eq(1);
  });

  it('should decode gzipped json data', () => {
    const obj = JSON.stringify({x : 2, y: "zzz"});
    const zipped = ce.cloneWith({ datacontenttype: 'application/json+gzip', data: ZLib.deflateSync(obj)});
    const result = body_parser<any>(zipped);
    expect(result.x).to.eq(2);
    expect(result.y).to.eq("zzz");
  });
});