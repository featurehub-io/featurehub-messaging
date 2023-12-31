import { TemplateProcessor } from './index';


process.env.FEATUREHUB_SOURCE = 'file';
const templater = new TemplateProcessor('slack.mustache');
templater.process(require(`../examples/${process.argv[2]}`)).then(payload => console.log(payload));