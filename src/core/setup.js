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
      'expected status code ' + responseStatus + ' to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody),
      'expected status code ' + responseStatus + ' not to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody)
    );
  });

  chakram.addMethod("schemaAnd200", (r, schema) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    const is200 = responseStatus === 200;
    assert(is200,
      'expected status code ' + responseStatus + ' to equal 200 - response body: ' + JSON.stringify(responseBody),
      'expected status code ' + responseStatus + ' not to equal 200 - response body: ' + JSON.stringify(responseBody)
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
