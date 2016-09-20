'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');
const membershipEventsPayload = require('./assets/membership-events');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  const build = (overrides) => Object.assign({}, customerPayload, overrides);
  const payload = build({ customerName: tools.random(), lastName: tools.random(), firstName: tools.random(), mobile: tools.randomInt() + '7153' + tools.randomInt() });
  it('should create a customer and then get/post for a membership events', () => {
    let customerId;
    return cloud.post(test.api, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(`${test.api}/1/membership-events`, membershipEventsPayload))
      .then(r => cloud.get(`${test.api}/1/membership-events`));
  });
});
