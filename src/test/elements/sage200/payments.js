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
  "name": "CE Payments"
})

suite.forElement('finance', 'payments', createPayment(), (test) => {
  let customerId;
  let bankId;
  let urnId;
  let paymentId;
  let receiptId;
  it('Should create a customer and then payments for that id', () => {
    return cloud.post('/hubs/finance/customers',createCustomer(tools.randomInt().toString()))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get('/hubs/finance/customers/' + customerId))
      .then(r => cloud.get('/hubs/finance/banks'))
      .then(r => bankId = r.body[0].id)
      .then(r => cloud.post(test.api,createPayment(customerId, bankId)))
      .then(r => urnId = r.body.urn)
      .then(r => cloud.get(test.api),{qs: {where: 'urn=\''+urnId +'\''}})
      .then(r => paymentId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + paymentId))
      .then(r => cloud.post(test.api + '/receipts',createPayment(customerId, bankId)))
      .then(r => urnId = r.body.urn)
      .then(r => cloud.get(test.api),{qs: {where: 'urn=\''+urnId +'\''}})
      .then(r => receiptId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + receiptId))
      .then(r => cloud.get(test.api));
      //can't delete a customer with transactions ...
      //.then(r => cloud.delete('/hubs/finance/customers/' + customerId));
  });
  test.should.supportPagination();
});
