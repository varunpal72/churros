'use strict';

const tester = require('core/tester');
const schema = require('./assets/taxes.schema');
const payload = require('./assets/taxes.create');
const badPayload = require('./assets/taxes.bad.create');

tester.for('finance', 'taxes', schema, (api) => {
  tester.it.shouldSupportPost(payload);
  tester.it.shouldReturn400OnPost(badPayload);
  tester.it.shouldReturn400OnPost();
  tester.it.shouldReturn400OnPost({});
});
