'use strict';

const suite = require('core/suite');
const payload = require('./assets/payments');
const customerPayload = require('./assets/customers');
const cloud = require('core/cloud');
const InvoicePayload = require('./assets/invoices');
const subscriptionPayload = require('./assets/subscriptions');
const paymentMethodPayload = require('./assets/paymentMethod');

suite.forElement('payment', 'payments', { payload: payload }, (test) => {
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
  it(`should allow CRUDS ${test.api}`, () => {
    const updatePayload = { "Status": "Voided" };
    let customerId, id, sid, invoiceId;
    const date = subscriptionPayload.contractEffectiveDate;
    InvoicePayload.InvoiceDate = date;
    InvoicePayload.TargetDate = date;
    const updateInvoicePayload = { "Status": "Posted" };
    return cloud.post(`/hubs/payment/customers`, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => subscriptionPayload.accountKey = customerId)
      .then(r => cloud.post(`/hubs/payment/subscriptions`, subscriptionPayload))
      .then(r => sid = r.body.id)
      .then(r => InvoicePayload.AccountId = customerId)
      .then(r => cloud.post(`/hubs/payment/invoices`, InvoicePayload))
      .then(r => invoiceId = r.body.id)
      .then(r => cloud.put(`/hubs/payment/invoices/${invoiceId}`, updateInvoicePayload))
      .then(r => paymentMethodPayload.AccountId = customerId)
      .then(r => cloud.post(`/hubs/payment/payment-methods`, paymentMethodPayload))
      .then(r => payload.PaymentMethodId = r.body.id)
      .then(r => payload.AccountId = customerId)
      .then(r => payload.InvoiceId = invoiceId)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.put(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${id}`))
      .then(r => cloud.delete(`/hubs/payment/customers/${customerId}`));
  });
});
