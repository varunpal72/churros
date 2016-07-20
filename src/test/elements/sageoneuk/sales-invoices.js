'use strict';

const suite = require('core/suite');
const payload = require('./assets/sales-invoices');
const chakram = require('chakram');
const cloud = require('core/cloud');

const paymentPayload = {
  "amount": "4.59",
  "date": "06/01/2016",
  "reference": "churros",
  "destination_id": "5559453"
};

suite.forElement('sageaccounting', 'sales-invoices', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'from_date=\'30/06/2016\' AND to_date=\'31/12/2016\'' } }).should.return200OnGet();
  let salesInvoiceId, paymentId;
  it('should create a sales-invoice and allow CRDS for payments', () => {
    return cloud.post(test.api, payload)
      .then(r => salesInvoiceId = r.body.id)
      .then(r => cloud.post(`${test.api}/${salesInvoiceId}/payments`, paymentPayload))
      .then(r => paymentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${salesInvoiceId}/payments/${paymentId}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get((`${test.api}/${salesInvoiceId}/payments`)))
      .then(r => cloud.delete(`${test.api}/${salesInvoiceId}/payments/${paymentId}`))
      .then(r => cloud.delete(`${test.api}/${salesInvoiceId}`));
  });
});