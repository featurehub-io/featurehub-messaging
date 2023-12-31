import { TemplateSource } from './source';
import { FileTemplateSource } from './file_source';
import { EnvTemplateSource } from './env_source';
import Handlebars from 'handlebars';

export class TemplateProcessor {
  private template: HandlebarsTemplateDelegate | undefined;
  private readonly source: TemplateSource | undefined;

  constructor(templateRef: string) {
    if (process.env.DEBUG) {
      console.log('TEMPLATE-PROCESSOR', process.env.FEATUREHUB_SOURCE);
    }
    switch (process.env.FEATUREHUB_SOURCE) {
      case 'file':
        this.source = new FileTemplateSource(templateRef);
        break;
      case 'env':
        this.source = new EnvTemplateSource(templateRef);
        break;
    }
  }

  async process(data: any): Promise<string | undefined> {
    if (this.source) {
      if (!this.template) {
        this.template = Handlebars.compile(await this.source.getTemplate());
      }

      if (this.template) {
        return this.template(this.readyForTemplate(data)).trim();
      } else {
        console.error('Template did not compile');
      }
    } else {
      console.error('No source of template');
    }

    return undefined;
  }

  // private detectLockJitter(data: any): boolean {
  //   // detect if only the lock changed. remove the lock text as well.
  //   // possible future enhancement.
  //   return false;
  // }

  private readyForTemplate(data: any): any {
    if (process.env.USE_GMT_DATE) {
      data.whenUpdatedReadable = data.whenUpdated;
    } else {
      data.whenUpdatedReadable = new Date(data.whenUpdated).toLocaleString();
    }

    if (data.strategiesUpdated) {
      data.addedStrategies = data.strategiesUpdated.filter((s: any) => s.updateType === 'ADDED').map((s: any) => s.newStrategy);
      data.updatedStrategies = data.strategiesUpdated.filter((s: any) => s.updateType === 'CHANGED');
      data.deletedStrategies = data.strategiesUpdated.filter((s: any) => s.updateType === 'DELETED').map((s: any) => s.oldStrategy);

      data.updatedStrategies.forEach((s: any) => {
        s.nameChanged = (s.newStrategy.name !== s.oldStrategy.name);
      });
    }

    if (data.lockUpdated) {
      data.wasLocked = (!data.lockUpdated.previous && data.lockUpdated.updated);
    }

    if (data.retiredUpdated) {
      data.wasRetired = (!data.retiredUpdated.previous && data.retiredUpdated.updated);
    }

    if (process.env.DEBUG) {
      console.log(JSON.stringify(data, null, 2));
    }

    return data;
  }
}


