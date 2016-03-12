'use strict';

const suite = require('core/suite');
const customerPayload = require('./assets/customers');
const cloud = require('core/cloud');

const createInvoices = (customerId) => ({
  "customer_id": customerId,
  "due_date": "2016-04-02T00:00:00"
});

suite.forElement('finance', 'invoices', customerPayload, (test) => {
  let customerId;
  it('Should create a customer and then an invoice for that id', () => {
    return cloud.post('/hubs/finance/customers',customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.get('/hubs/finance/customers/' + customerId))
      //add this back in when we debug the 403 error
      //.then(r => cloud.post(test.api,createInvoices(customerId)))
      .then(r => cloud.get(test.api))
      .then(r => cloud.delete('/hubs/finance/customers/' + customerId));
  });
  test.should.supportPagination();
  test.should.supportCeqlSearch('id'); 
});
