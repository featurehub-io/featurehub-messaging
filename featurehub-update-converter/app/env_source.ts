import {TemplateSource} from "./source";


export class EnvTemplateSource implements TemplateSource {
  constructor() {
    if (!process.env.MUSTACHE_TEMPLATE) {
      console.error('Must specify the MUSTACHE_TEMPLATE env var which stores the mustache template');
    }
  }
  async getTemplate(): Promise<string> {
    return process.env.MUSTACHE_TEMPLATE!;
  }
}
