import { parse, stringify } from 'yaml'
import * as fs from 'fs';
import Handlebars from "handlebars";

interface OverrideDefinition {
  steps: Array<string> | undefined;
}

interface BuildDefinition {
  packages: Array<string>;
  overrides: Record<string, OverrideDefinition> | undefined;
  defaultSteps: Array<string>;
  stepDefinitions: Record<string, Array<string>>;
}

function stepDefMap(steps: Array<string>, pkgFile: any): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  steps.forEach(s => {
    if (pkgFile["scripts"][s]) {
      map[s] = true;
    }
  });
  return map;
}

const baseDir = process.env.BASE_DIR || '.';
const buildDefinition = parse(fs.readFileSync(`${baseDir}/.github/gen-build.yaml`, 'utf-8')) as BuildDefinition;

for(let pkg of buildDefinition.packages) {
  const pkgFile = JSON.parse(fs.readFileSync(`${baseDir}/${pkg}/package.json`, 'utf-8'));

  let steps = buildDefinition.defaultSteps;

  if (buildDefinition.overrides && buildDefinition.overrides[pkg]?.steps) {
    steps = buildDefinition.overrides[pkg].steps;
  }

  for(let step of steps) {
    const templateFile = fs.readFileSync(`templates/${step}.yaml.mustache`, 'utf-8').toString();
    const template = Handlebars.compile(templateFile);
    const data = template({
      folder: pkg,
      buildParts: stepDefMap(buildDefinition.stepDefinitions[step], pkgFile),
      packageName: pkgFile.name,
      pkgFile: pkgFile
    })
    fs.writeFileSync(`${baseDir}/.github/workflows/${pkgFile.name}-${step}.yml`, data);
  }
}

