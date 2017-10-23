'use strict';

const assert = require('assert');
const tv4 = require('tv4');
const chakram = require('chakram');

chakram.addMethod('statusCode', (r, status) => {
  if (!r || !r.response) {
    let msg = 'Unable to validate HTTP status code from response: ';
    msg += r ? JSON.stringify(r) : null;
    throw Error(msg);
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
  if (!r || !r.response) {
    let msg = 'Unable to validate HTTP status code and schema from response: ';
    msg += r ? JSON.stringify(r) : null;
    throw Error(msg);
  }

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
    if (tv4.error !== null) {
      console.log('Error: ', tv4.error);
      console.log('Body: ', r.response.body);
      errorMsg += ' - ' + tv4.error.message;
    }

    return errorMsg;
  };

  assert(valid, composeErrorMessage());
});
