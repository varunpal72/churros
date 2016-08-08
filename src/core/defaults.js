'use strict';

const chakram = require('chakram');
const logger = require('winston');

let baseUrl = null;
let userSecret = null;
let orgSecret = null;
let username = null;

const setDefaults = (b, u, o, un) => {
  logger.debug('Modifying the chakram default request headers and base url');
  chakram.setRequestDefaults({
    baseUrl: b,
    headers: {
      Authorization: `User ${userSecret}, Organization ${orgSecret}`,
      'User-Agent': `Churrosbot/${un}`
    }
  });
};

const validate = (b, u, o, un) => {
  if (!b) throw Error('The base URL was never set. Cannot reset until properly initialized');
  if (!u) throw Error('The user secret was never set. Cannot reset until properly initialized');
  if (!o) throw Error('The org secret was never set. Cannot reset until properly initialized');
  if (!un) throw Error('The username was never set. Cannot reset until properly initialized');
};

var exports = module.exports = (b, u, o, un) => {
  validate(b, u, o, un);
  baseUrl = b;
  userSecret = u;
  orgSecret = o;
  username = un;
  setDefaults(b, u, o, un);
};

exports.reset = () => {
  validate(baseUrl, userSecret, orgSecret, username);
  setDefaults(baseUrl, userSecret, orgSecret, username);
};

exports.token = (token) => {
  logger.debug('Adding token to our default request headers');
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: {
      Authorization: `User ${userSecret}, Organization ${orgSecret}, Element ${token}`,
      'User-Agent': `Churrosbot/${username}`
    }
  });
};
