'use strict';

const suite = require('core/suite');
const payload = require('./assets/purchase-invoices');
const chakram = require('chakram');
const cloud = require('core/cloud');

const paymentPayload = {
  "amount": "4.59",
  "date": "06/01/2016",
  "reference": "churros",
  "source_id": "5559453"
};

const options = {
  churros: {
    updatePayload: {
      "contact_id": "7854254",
      "contact_name": "Bab",
      "due_date": "31/12/2016",
      "date": "06/01/2016",
      "line_items": [{
        "description": "churros update",
        "quantity": "5.0",
        "unit_price": "4.59",
        "tax_code_id": "1",
        "ledger_account_id": "5559491",
        "ledger_account": {
          "$key": 5559491,
          "id": 5559491
        }
      }]
    }
  }
};

suite.forElement('sageaccounting', 'purchase-invoices', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'from_date=\'30/06/2016\' AND to_date=\'31/12/2016\'' } }).should.return200OnGet();
  let purchaseInvoiceId, paymentId;
  it('should create a purchase-invoice and allow CRDS for payments', () => {
    return cloud.post(test.api, payload)
      .then(r => purchaseInvoiceId = r.body.id)
      .then(r => cloud.post(`${test.api}/${purchaseInvoiceId}/payments`, paymentPayload))
      .then(r => paymentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${purchaseInvoiceId}/payments/${paymentId}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get((`${test.api}/${purchaseInvoiceId}/payments`)))
      .then(r => cloud.delete(`${test.api}/${purchaseInvoiceId}/payments/${paymentId}`))
      .then(r => cloud.delete(`${test.api}/${purchaseInvoiceId}`));
  });
});