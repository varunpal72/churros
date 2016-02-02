'use strict';

const tester = require('core/tester');
const schema = require('./assets/taxes.schema');
const payload = require('./assets/taxes.create');
const badPayload = require('./assets/taxes.bad.create');

tester.for('finance', 'taxes', (api) => {
  tester.test.create(api, payload, schema);
  tester.test.badPost400(api, badPayload);
  tester.test.badPost400(api);
});
