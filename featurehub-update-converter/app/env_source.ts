import { TemplateSource } from './source';


export class EnvTemplateSource implements TemplateSource {
  private readonly source: string;

  constructor(templateRef: string) {
    this.source = templateRef;
  }

  getTemplate(): string {
    return this.source;
  }
}
