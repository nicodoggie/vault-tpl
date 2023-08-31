const path = require('path');
const fs = require('fs/promises');
const YAML = require('js-yaml');

function getOutput({ name, ext }, output) {
  if (output) {
    return output;
  }

  return `${name}-output${ext}`;
}

async function writeOutput(filename, data, { write }) {
  if (!write) {
    console.log(data);
    return;
  }

  await fs.writeFile(filename, data);
}

async function writeOutputYaml(filename, data, { write }) {
  const output = YAML.safeDump(data, {
    lineWidth: 200,
  });

  if (!write) {
    console.log(output);
    return;
  }

  await fs.writeFile(filename, output);
}

module.exports = async function (file, options) {
  await require('../utils/validate')();

  const parse = require('./parse');
  const { fetchSecrets } = require('./fetch-secrets');
  const { replaceSecrets } = require('./replace-secrets');
  const { replaceSecretsYaml } = require('./replace-secrets-yaml');

  const { write } = options;

  const { name, ext } = path.parse(file);
  const outputFilename = getOutput({ name, ext }, options.output);
  const raw = await fs.readFile(file);
  const matches = parse(raw);
  const secrets = await fetchSecrets(matches);

  if (/\.ya?ml$/.test(file)) {
    const yamlObj = YAML.load(raw);
    const output = replaceSecretsYaml(yamlObj, secrets);
    await writeOutputYaml(outputFilename, output, {
      write,
    });
  } else {
    const output = replaceSecrets(raw, secrets);
    await writeOutput(outputFilename, output, {
      write,
    });
  }
};
