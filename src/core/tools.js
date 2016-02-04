'use strict';

const assert = require('assert');
const tv4 = require('tv4');
const chakram = require('chakram');
const util = require('util');
const logger = require('core/logger');

var exports = module.exports = {};

exports.addCustomAssertions = () => {
  chakram.addMethod('statusCode', (r, status) => {
    if (!r || !r.response) {
      logger.error('Unable to validate HTTP status code from response %s', {r: r});
      return;
    }

    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    assert(
      responseStatus === status,
      'expected status code ' + responseStatus + ' to equal ' + status + ' - ' + JSON.stringify(responseBody),
      'expected status code ' + responseStatus + ' not to equal ' + status + ' - ' + JSON.stringify(responseBody)
    );
  });

  chakram.addMethod("schemaAnd200", (r, schema) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    const is200 = responseStatus === 200;
    assert(is200,
      'expected status code ' + responseStatus + ' to equal 200 - ' + JSON.stringify(responseBody),
      'expected status code ' + responseStatus + ' not to equal 200 - ' + JSON.stringify(responseBody)
    );

    const valid = tv4.validate(r.response.body, schema);
    const composeErrorMessage = () => {
      let errorMsg = 'expected body to match JSON schema';
      if (tv4.error !== null) errorMsg += ' - ' + tv4.error.message;
      return errorMsg;
    };

    assert(valid, composeErrorMessage());
  });
};

exports.authReset = (props, token) => {
  const url = props.get('url');
  const us = props.get('user.secret');
  const os = props.get('org.secret');

  token ?
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: { Authorization: util.format('User %s, Organization %s, Element %s', us, os, token) }
    }) :
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: { Authorization: util.format('User %s, Organization %s', us, os) }
    });
};

exports.random = () => Math.random().toString(36).substring(7);

exports.randomInt = () => Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

exports.logAndThrow = (msg, error, arg) => {
  arg ? logger.error(msg, arg) : logger.error(msg);
  throw error;
};
