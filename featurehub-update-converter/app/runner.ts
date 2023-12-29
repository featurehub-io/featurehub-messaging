import {TemplateProcessor} from "./index";


process.env.SOURCE="file"
process.env.FILE_MUSTACHE_TEMPLATE='slack.mustache';
const templater = new TemplateProcessor();
templater.process(require(`../examples/${process.argv[2]}`)).then(payload => console.log(payload));