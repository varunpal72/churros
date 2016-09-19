'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');
const membershipEventsPayload = require('./assets/membership-events');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  customerPayload.lastName = tools.random();
  customerPayload.firstName = tools.random();
  customerPayload.customerName = tools.random();
  customerPayload.mobile = '9876543' + tools.randomInt();
  membershipEventsPayload.point = tools.randomInt();
  it('should create a customer and then get/post for a membership events', () => {
    let customerId;
    return cloud.post(test.api, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(`${test.api}/1/membership-events`, membershipEventsPayload))
      .then(r => cloud.get(`${test.api}/1/membership-events`));
  });
});
