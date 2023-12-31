import { TemplateSource } from './source';
import * as fs from 'fs';


export class FileTemplateSource implements TemplateSource {
  private source: string;

  constructor(templateRef: string) {
    this.source = fs.readFileSync(templateRef, 'utf-8');
  }

  getTemplate(): string {
    return this.source;
  }
}
