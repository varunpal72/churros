'use strict';

const suite = require('core/suite');
/* // Commented out since we are not doing POSTs
const charge = require('./assets/charges');
const refund = require('./assets/refunds');*/
const tools = require('core/tools');
const cloud = require('core/cloud');

const updateRefunds = () => ({
  "metadata": {
    "key": tools.random()
  }
});

suite.forElement('payment', 'refunds', (test) => {
/* // Commented out the POSTs since there are no DELETE APIs for the same. Instead hardcoded a value to run other APIs
  let chargeId;
  before(() => cloud.post(`/hubs/payment/charges`,charge)
    .then(r => chargeId = r.body.id)
  );
  it(`should allow CRU for /hubs/payment/charges/{chargeId}/refunds`, () => {
    let refundId;
    return cloud.post(`/hubs/payment/charges/${chargeId}/refunds`, refund)
      .then(r => refundId = r.body.id)
      .then(r => cloud.get(`${test.api}/${refundId}`))
      .then(r => cloud.patch(`${test.api}/${refundId}`, updateRefunds()));
  });*/
  let refundId = "re_184b9DGdZbyQGmEeAbIgMMYZ";
  test.should.return200OnGet();
  it(`should allow RU for /hubs/payment/charges/{chargeId}/refunds`, () => {
    return cloud.get(`${test.api}/${refundId}`)
      .then(r => cloud.patch(`${test.api}/${refundId}`, updateRefunds()));
  });
});
