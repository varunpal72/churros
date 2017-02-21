'use strict';

const suite = require('core/suite');
const payload = require('./assets/invoices');
const customerPayload = require('./assets/customers');
const tools = require('core/tools');
const subscriptionPayload = require('./assets/subscriptions');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const invoicesPayload = build({ CreditCardAddress1: tools.random() });
suite.forElement('payment', 'invoices', { payload: invoicesPayload }, (test) => {

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
    const updatePayload = { "Status": "Canceled" };
    const date = subscriptionPayload.contractEffectiveDate;
    payload.InvoiceDate = date;
    payload.TargetDate = date;
    // const customerUpdatePayload ={"status":"Active"}
    let sid, id, customerId;
    // invoicePayload.AccountId=customerId;
    return cloud.post(`/hubs/payment/customers`, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => subscriptionPayload.accountKey = customerId)
      .then(r => cloud.post(`/hubs/payment/subscriptions`, subscriptionPayload))
      .then(r => sid = r.body.id)
      .then(r => payload.AccountId = customerId)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      //.then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.put(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${id}`))
      .then(r => cloud.delete(`/hubs/payment/customers/${customerId}`));
  });
});
