'use strict';

const suite = require('core/suite');
const customerPayload = require('./assets/customers');
const tools = require('core/tools');
const cloud = require('core/cloud');

const createInvoices = (customerId) => ({
  "customer_id": customerId,
  "due_date": "2016-04-02T00:00:00"
});

const createCustomer = (rando) => ({
  "reference": "CE"+ rando ,
  "name": "CE Invoices"
})

suite.forElement('finance', 'invoices', createInvoices(), (test) => {
  let customerId;
  let urnId;
  let invoiceId;
  it('Should create a customer and then an invoice for that id', () => {
    return cloud.post('/hubs/finance/customers',createCustomer(tools.randomInt().toString()))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get('/hubs/finance/customers/' + customerId))
      .then(r => cloud.post(test.api,createInvoices(customerId)))
      .then(r => urnId = r.body.urn)
      .then(r => cloud.get(test.api),{qs: {where: 'urn=\''+urnId +'\''}})
      .then(r => invoiceId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + invoiceId));
      //can't delete a customer with transactions ...
      //.then(r => cloud.delete('/hubs/finance/customers/' + customerId));
  });
  test.should.supportPagination();
});
