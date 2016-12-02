'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');
const notesPayload = require('./assets/notes');

suite.forElement('ecommerce', 'customers', { payload: customerPayload, skip: true }, (test) => {
  const build = (overrides) => Object.assign({}, customerPayload, overrides);
  const payload = build({ customerName: tools.random(), lastName: tools.random(), firstName: tools.random(), mobile: tools.randomInt() + '7153' + tools.randomInt() });
  it('should create a customer and then CRDS for a customer', () => {
    let customerId;
    return cloud.post(test.api, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${customerId}/notes`, notesPayload))
      .then(r => cloud.get(`${test.api}/${customerId}/notes`), { qs: { page: 1, pageSize: 1 } });
  });
});
