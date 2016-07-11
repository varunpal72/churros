'use strict';

const suite = require('core/suite');
const payload = require('./assets/purchase-invoices');
const chakram = require('chakram');
const cloud = require('core/cloud');

const paymentPayload = {
      "amount": "10.0",
      "date": "2016-06-23",
      "reference": "ce002",
      "bank_account_id": 142271
};

suite.forElement('accounting', 'purchase-invoices', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'updated_or_created_since =\'2016-06-01\'' } }).should.return200OnGet();
  let purchaseInvoiceId, paymentId;
  it('should create a purchase-invoice and allow CRUDS for payments', () => {
    return cloud.post(test.api, payload)
      .then(r => purchaseInvoiceId = r.body.id)
      .then(r => cloud.post(`${test.api}/${purchaseInvoiceId}/payments`, paymentPayload))
      .then(r => paymentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${purchaseInvoiceId}/payments/${paymentId}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1} }).get((`${test.api}/${purchaseInvoiceId}/payments`)))
      .then(r => cloud.put(`${test.api}/${purchaseInvoiceId}/payments/${paymentId}`, paymentPayload))
      .then(r => cloud.delete(`${test.api}/${purchaseInvoiceId}/payments/${paymentId}`))
      .then(r => cloud.delete(`${test.api}/${purchaseInvoiceId}`));
  });
});
