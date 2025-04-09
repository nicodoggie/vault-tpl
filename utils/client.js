const config = require('./config');
const axios = require('axios');

const headers = {
  'x-vault-token': config.VAULT_TOKEN,
};

if (config['CF-Access-Client-Id'] && config['CF-Access-Client-Secret']) {
  headers['CF-Access-Client-Id'] = config['CF-Access-Client-Id'];
  headers['CF-Access-Client-Secret'] = config['CF-Access-Client-Secret'];
}

const instance = axios.create({
  baseURL: `${config.VAULT_ADDR}/v1/`,
  timeout: 100000,
  headers,
});

module.exports = instance;
