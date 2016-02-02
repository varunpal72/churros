'use strict';

const assert = require('assert');
const tv4 = require('tv4');
const chakram = require('chakram');
const util = require('util');

var exports = module.exports = {};

exports.initializeChakram = () => {
  chakram.addMethod('statusCode', (r, status) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    assert(
      responseStatus === status,
      'expected status code ' + responseStatus + ' to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody, null, 2),
      'expected status code ' + responseStatus + ' not to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody, null, 2)
    );
  });

  chakram.addMethod("schemaAnd200", (r, schema) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    const composeErrorMessage = () => {
      let errorMsg = 'expected body to match JSON schema\n';
      if (tv4.error !== null) {
        errorMsg += util.format('error:%s\n', tv4.error.message);
        errorMsg += util.format('expected schema:\n%s\n', JSON.stringify(schema, null, 2));
        errorMsg += util.format('response body:\n%s\n', JSON.stringify(responseBody, null, 2));
      }
      return errorMsg;
    };

    const is200 = responseStatus === 200;
    const message = util.format('expected %s to be 200.  response body was \n%s', responseStatus, JSON.stringify(responseBody, null, 2));
    assert(is200, message);

    const valid = tv4.validate(r.response.body, schema);
    assert(
      valid,
      composeErrorMessage(),
      'expected body to not match JSON schema ' + JSON.stringify(schema)
    );
  });
};
