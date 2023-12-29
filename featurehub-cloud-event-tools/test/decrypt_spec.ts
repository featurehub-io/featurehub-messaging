import {SymmetricDecrypter} from '../app';
import {expect} from 'chai';


describe('decryption should work as expected', ()=> {
  let sd: SymmetricDecrypter;

  beforeEach(() => sd = new SymmetricDecrypter('oE5gRKmX9STnSD'));

  it('should decrypt', () => {
    const record = sd.decrypt({
      'integration.slack.enabled': 'true',
      'integration.slack.channel_name': 'C0542MDQ0TH',
      'integration.slack.encrypt': 'integration.slack.token',
      'integration.slack.token': 'ENCRYPTED-TEXT',
      'integration.slack.token.encrypted': 'kvVTtMJFJdeO92NtnhddIN0b+2xdXjjmAAWVd/zOK2iP9V1e2xuDQuNR9A==',
      'integration.slack.token.salt': '0d864150-2714-4ceb-8a64-3d565b7c7f9c'});

    expect(Object.keys(record).length).to.eq(3);
    expect(record['integration.slack.token']).to.eq('blah-token-blah');
    expect(record['integration.slack.channel_name']).to.eq('C0542MDQ0TH');
  });
});

