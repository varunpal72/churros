'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customersPayload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: customersPayload }, (test) => {
  let customerId;
  const mobNumber = '9876543';
  customersPayload.lastName = tools.random();
  customersPayload.firstName = tools.random();
  customersPayload.mobile = '' + mobNumber + '' + tools.randomInt();
  it('should create a customer and then patch for membership', () => {
    return cloud.post(test.api, customersPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${customerId}/membership/disable`), null)
      .then(r => cloud.patch(`${test.api}/${customerId}/membership/enable`), null);
  });
});
