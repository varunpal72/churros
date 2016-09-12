'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');
const membershipEventsPayload = require('./assets/membership-events');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  let customerId;
  const mobNumber = '9876543';
  customerPayload.lastName = tools.random();
  customerPayload.firstName = tools.random();
  customerPayload.customerName = tools.random();
  customerPayload.mobile = '' + mobNumber + '' + tools.randomInt();
  membershipEventsPayload.point = tools.randomInt();
  it('should create a customer and then get/post for a membership events', () => {
    return cloud.post(test.api, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(`${test.api}/1/membership-events`, membershipEventsPayload))
      .then(r => cloud.get(`${test.api}/1/membership-events`));
  });
});
