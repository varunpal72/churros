'use strict';

const suite = require('core/suite');
const attachmentPayload = require('./assets/attachment');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  const mobNumber = '9876503';
  let customerId;
  attachmentPayload.name = tools.random() + '.png';
  customerPayload.lastName = tools.random();
  customerPayload.firstName = tools.random();
  customerPayload.customerName = tools.random();
  customerPayload.mobile = '' + mobNumber + '' + tools.randomInt();
  it('should create a customer and then CRDS for an attachment', () => {
    return cloud.post(test.api, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.crds(`${test.api}/${customerId}/attachments`, attachmentPayload))
      .then(r => cloud.get(`${test.api}/${customerId}/attachments`), { qs: { page: 1, pageSize: 1 } });
  });
});
