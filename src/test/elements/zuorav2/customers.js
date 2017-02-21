'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const chakram = require('chakram');
const subscriptionPayload = require('./assets/subscriptions');
const tools = require('core/tools');
const cloud = require('core/cloud');
const paymentPayload = require('./assets/CustomerPaymentMethod');
const invoicePayload = require('./assets/customerInvoices');
suite.forElement('payment', 'customers', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };

  let rateId, charge;
  before(() => {
    return cloud.get(`/hubs/payment/products`)
      .then(r => {
        var match = r.body.filter(function(list) {
          return list.productRatePlans.length !== 0;
        });
        if (match.length >= 0) {
          let rate = match[0].productRatePlans;
          rateId = rate[0].id;
          charge = rate[0].productRatePlanCharges[0].id;
          subscriptionPayload.subscribeToRatePlans[0].productRatePlanId = rateId;
          subscriptionPayload.subscribeToRatePlans[0].chargeOverrides[0].productRatePlanChargeId = charge;
        } else {
          // bail
        }
      });
  });
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds(chakram.put);

  it(`should allow CRUDS ${test.api}/id/payment-method,GET ${test.api}/id/history,GET ${test.api}/id/payments CS for ${test.api}/id/invoices and CS for   ${test.api}/id/subscriptions `, () => {
    let customerId, paymentId;
    const paymentUpdatePayload = { "cardHolderName": "Leo" };
    return cloud.post(`/hubs/payment/customers`, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/history`))
      .then(r => cloud.get(`${test.api}/${customerId}/payments`))
      .then(r => cloud.post(`${test.api}/${customerId}/payment-methods`, paymentPayload))
      .then(r => paymentId = r.body.paymentMethodId)
      .then(r => cloud.get(`${test.api}/${customerId}/payment-methods`))
      .then(r => cloud.put(`${test.api}/${customerId}/payment-methods/${paymentId}`, paymentUpdatePayload))
      .then(r => payload.accountKey = customerId)
      .then(r => cloud.delete(`${test.api}/${customerId}/payment-methods/${paymentId}`))
      .then(r => cloud.post(`${test.api}/${customerId}/subscriptions`, subscriptionPayload))
      .then(r => cloud.get(`${test.api}/${customerId}/subscriptions`))
      .then(r => cloud.post(`${test.api}/${customerId}/invoices`, invoicePayload))
      .then(r => cloud.get(`${test.api}/${customerId}/invoices`));


  });

});
