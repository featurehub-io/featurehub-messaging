import * as crypto from "crypto";

const ivLengthInBytes = 12
const secretKeyAlgorithm = "sha256"
const iterationCount = 65536
const keyLength = 32
const cipherTransformation = "aes-256-gcm"
const TAG_LENGTH_BIT = 128

export class SymmetricDecrypter {

  private readonly password: string;

  constructor(password: string) {
    this.password = password;
  }

  decryptText(cipherText: string, salt: string): string {
    const key = crypto.pbkdf2Sync(this.password, salt, iterationCount, keyLength, secretKeyAlgorithm);

    let encrypted = Buffer.from(cipherText, "base64")
    const iv =  encrypted.subarray(0, ivLengthInBytes)
    const auth = encrypted.subarray(encrypted.length - (TAG_LENGTH_BIT/8), encrypted.length)
    encrypted = encrypted.subarray(ivLengthInBytes, encrypted.length - (TAG_LENGTH_BIT/8))

    const decipher = crypto.createDecipheriv(cipherTransformation, key, iv);

    let decrypted = decipher.update(encrypted, null, 'utf8');
    decipher.setAuthTag(auth)
    decrypted += decipher.final('utf8');
    if (process.env.DEBUG) {
      console.log(decrypted);
    }
    return decrypted;
  }

  decrypt(info: Record<string, string>): Record<string, string> {
    if (process.env.DEBUG) {
      console.log('decrypting', info);
    }
    const flds: Record<string, string> = {};
    const skip: Record<string, string> = {};
    for(const key in info) {
      if (key.endsWith(".encrypt")) {
        info[key].split(',').map(s => s.trim()).filter(s => s.length > 0).forEach(fld => {
          const encrypted = info[`${fld}.encrypted`];
          const salt = info[`${fld}.salt`];
          if (encrypted && salt) {
            flds[fld] = this.decryptText(encrypted, salt);
            skip[fld] = '';
          }

          skip[`${fld}.encrypted`] = '';
          skip[`${fld}.salt`] = '';
        });

        skip[key] = '';
      }
    }
    for(const key in info) {
      if (skip[key] === undefined) {
        flds[key] = info[key];
      }
    }
    return flds;
  }

}
//
// const sd = new SymmetricDecrypter(process.env.PASSWORD);
//
// const record = sd.decrypt({
//   "integration.slack.enabled": "true",
//   "integration.slack.api_key": "ENCRYPTED-TEXT",
//   "integration.slack.channel_name": "C0542MDQ0TH",
//   "integration.slack.encrypt": "integration.slack.token",
//   "integration.slack.token": "ENCRYPTED-TEXT",
//   "integration.slack.token.encrypted": "cYvuUixN92qV6ojLCliwqPKM4Q1jxP66MyOWCoWS9U97daLGNTtuqUtaa1LKpKvaBJ5mm2coOiHkZ2ws5sf2pglO74txr/VQ1cisy3dicHQMrwaaTw==",
//   "integration.slack.token.salt": "f8e80a15-924d-4705-b8fe-7ac671ede1a4"});
//
// console.log('result of decrypt is ', record);
