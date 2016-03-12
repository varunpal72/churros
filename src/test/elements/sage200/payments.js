'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const customerPayload = require('./assets/customers');
const cloud = require('core/cloud');

const createPayment = (customerId, bankId) => ({
  "customer_id": customerId,
  "bank_id": bankId,
  "cheque_value": 200.00
});

const createCustomer = (rando) => ({
  "reference": "CE"+ rando ,
  "name": "Tyler"
})

suite.forElement('finance', 'payments', createPayment(), (test) => {
  let customerId;
  let bankId;
  it('Should create a customer and then payments for that id - have to mod reference number after execution', () => {
    return cloud.post('/hubs/finance/customers',createCustomer(tools.randomInt().toString()))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get('/hubs/finance/customers/' + customerId))
      .then(r => cloud.get('/hubs/finance/banks'))
      .then(r => bankId = r.body[0].id)
      //add this back in when we debug the 403 error
      .then(r => cloud.post(test.api,createPayment(customerId, bankId)))
      .then(r => cloud.post(test.api + '/receipts',createPayment(customerId, bankId)))
      .then(r => cloud.get(test.api))
      //can't delete a customer with transactions ...
      //.then(r => cloud.delete('/hubs/finance/customers/' + customerId));
  });
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
