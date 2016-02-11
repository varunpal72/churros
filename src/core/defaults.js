'use strict';

const chakram = require('chakram');
const util = require('util');
const logger = require('winston');

let baseUrl = null;
let userSecret = null;
let orgSecret = null;

const setDefaults = (b, u, o) => {
  logger.debug('Modifying the chakram default request headers and base url');
  chakram.setRequestDefaults({
    baseUrl: b,
    headers: { Authorization: util.format('User %s, Organization %s', userSecret, orgSecret) }
  });
};

var exports = module.exports = (b, u, o) => {
  baseUrl = b;
  userSecret = u;
  orgSecret = o;
  setDefaults(b, u, o);
};

exports.reset = () => {
  if (!baseUrl) throw Error('The base URL was never set. Cannot reset until properly initialized');
  if (!userSecret) throw Error('The user secret was never set. Cannot reset until properly initialized');
  if (!orgSecret) throw Error('The org secret was never set. Cannot reset until properly initialized');

  setDefaults(baseUrl, userSecret, orgSecret);
};

exports.token = (token) => {
  logger.debug('Adding token to our default request headers');
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: { Authorization: util.format('User %s, Organization %s, Element %s', userSecret, orgSecret, token) }
  });
};
