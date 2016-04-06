'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const createInvoices = (customerId) => ({
  "customer_id": customerId
});

const createCustomer = (rando) => ({
  "reference": "CE" + rando,
  "name": "CE Invoices"
});

suite.forElement('finance', 'invoices', { payload: createInvoices() }, (test) => {
  let customerId, urnId, invoiceId;
  it('should create a customer and then an invoice for that id', () => {
    return cloud.post('/hubs/finance/customers', createCustomer(tools.randomInt().toString()))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get('/hubs/finance/customers/' + customerId))
      .then(r => cloud.post(test.api, createInvoices(customerId)))
      .then(r => urnId = r.body.urn)
      .then(r => cloud.get(test.api), { qs: { where: 'urn=\'' + urnId + '\'' } })
      .then(r => invoiceId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + invoiceId));
  });
  test.should.supportPagination();
});
