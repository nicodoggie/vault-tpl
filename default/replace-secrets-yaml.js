const parse = require('./parse');
const { keyBy, get } = require('lodash');

module.exports.replaceSecretsYaml = function (yamlObj, secrets) {
  const keyedSecrets = keyBy(secrets, 'id');
  Object.entries(yamlObj).map(([key, value]) => {
    const { id } = parse(value)[0] ?? {};

    if (!id) {
      return;
    }

    const secret = get(keyedSecrets, [id, 'secret'], '');
    yamlObj[key] = secret;
  });

  return yamlObj;
};
