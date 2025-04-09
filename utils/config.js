require('dotenv').config({ silent: true });
const { readFileSync } = require('fs');
const { resolve } = require('path');

function getToken() {
  if (process.env.VAULT_TOKEN) {
    return process.env.VAULT_TOKEN.trim();
  }

  if (process.env.VAULT_TOKEN_PATH) {
    return readFileSync(process.env.VAULT_TOKEN_PATH, 'utf8').trim();
  }

  const defaultPath = resolve(process.env.HOME, '.vault-token');

  return readFileSync(defaultPath, 'utf8').trim();
}

const config = {
  VAULT_ADDR: process.env.VAULT_ADDR,
  VAULT_TOKEN: getToken(),
  'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID,
  'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET,
};

module.exports = config;
