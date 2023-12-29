import {TemplateSource} from "./source";
import * as fs from "fs";


export class FileTemplateSource implements TemplateSource {
  private source: string | undefined;

  constructor() {
    if (!process.env.FILE_MUSTACHE_TEMPLATE) {
      console.error('Must specify the FILE_MUSTACHE_TEMPLATE env var which stores the mustache template');
    }
    if (!fs.existsSync(process.env.FILE_MUSTACHE_TEMPLATE)) {
      console.error(`File ${process.env.FILE_MUSTACHE_TEMPLATE} does not exist!`);
    }
  }

  async getTemplate(): Promise<string>{
    if (this.source === undefined) {
      this.source = fs.readFileSync(process.env.FILE_MUSTACHE_TEMPLATE, 'utf-8');
    }

    return this.source;
  }
}
