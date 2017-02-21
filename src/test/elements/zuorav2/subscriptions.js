'use strict';

const suite = require('core/suite');
const payload = require('./assets/subscriptions');
const tools = require('core/tools');
const customerPayload = require('./assets/customers');
const cloud = require('core/cloud');

suite.forElement('payment', 'subscriptions', { payload: payload }, (test) => {
  const updatePayload = {
    "notes": tools.random()
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
          payload.subscribeToRatePlans[0].productRatePlanId = rateId;
          payload.subscribeToRatePlans[0].chargeOverrides[0].productRatePlanChargeId = charge;
        } else {
          // bail
        }
      });
  });
  test.should.supportPagination();
  it(`should allow CRUDS ${test.api}`, () => {
    let id, customerId;
    const previewPayload = { "contractEffectiveDate": "2015-1-15", "initialTerm": 12, "initialTermPeriodType": "Week", "previewAccountInfo": { "billCycleDay": 31, "billToContact": { "city": "Walnut Creek", "country": "United States", "county": "Contra Consta", "state": "California", "zipCode": "94549" }, "currency": "USD" }, "subscribeToRatePlans": [{ "chargeOverrides": [{ "productRatePlanChargeId": "c3ae26226860f5ef425eeafff8efd36a" }], "productRatePlanId": "c3ae2622721fc3a6c82eeebc7b386798" }], "termType": "TERMED" };
    previewPayload.subscribeToRatePlans[0].productRatePlanId = rateId;
    previewPayload.subscribeToRatePlans[0].chargeOverrides[0].productRatePlanChargeId = charge;


    const renewUpdatePayload = { "collect": false, "invoice": true };

    const cancleUpdatePayload = { "cancellationEffectiveDate": "2015-01-31", "cancellationPolicy": "SpecificDate", "collect": false, "invoice": true };

    return cloud.post(`/hubs/payment/customers`, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => payload.accountKey = customerId)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.put(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.post(`${test.api}/preview`, previewPayload))
      .then(r => cloud.put(`${test.api}/${id}/cancel`, cancleUpdatePayload))
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.put(`${test.api}/${id}/renew`, renewUpdatePayload))
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.delete(`${test.api}/${id}`))
      .then(r => cloud.delete(`/hubs/payment/customers/${customerId}`));
  });
});
