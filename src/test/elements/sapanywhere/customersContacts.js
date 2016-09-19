'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  customerPayload.lastName = tools.random();
  customerPayload.firstName = tools.random();
  customerPayload.customerName = tools.random();
  customerPayload.mobile = tools.randomInt()+'6543' + tools.randomInt();
  it('should create a customer and then get for contacts', () => {
    let customerId;
    return cloud.post(test.api, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/contacts`), { qs: { page: 1, pageSize: 1 } });
  });
});
