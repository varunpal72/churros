'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customersPayload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: customersPayload, skip: true }, (test) => {
  const build = (overrides) => Object.assign({}, customersPayload, overrides);
  const payload = build({ lastName: tools.random(), firstName: tools.random(), mobile: tools.randomInt() + '7153' + tools.randomInt() });
  it('should create a customer and then patch for membership', () => {
    let customerId;
    return cloud.post(test.api, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${customerId}/membership/disable`), null)
      .then(r => cloud.patch(`${test.api}/${customerId}/membership/enable`), null);
  });
});
