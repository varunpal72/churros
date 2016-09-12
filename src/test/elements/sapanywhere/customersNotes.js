'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');
const notesPayload = require('./assets/notes');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  let customerId;
  const mobNumber = '9876543';
  customerPayload.lastName = tools.random();
  customerPayload.firstName = tools.random();
  customerPayload.customerName = tools.random();
  customerPayload.mobile = '' + mobNumber + '' + tools.randomInt();
  it('should create a customer and then CRDS for a customer', () => {
    return cloud.post(test.api, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${customerId}/notes`, notesPayload))
      .then(r => cloud.get(`${test.api}/${customerId}/notes`), { qs: { page: 1, pageSize: 1 } });
  });
});
