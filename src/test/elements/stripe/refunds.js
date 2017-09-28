'use strict';

const suite = require('core/suite');
const charge = require('./assets/charges');
const refund = require('./assets/refunds');
const tools = require('core/tools');
const cloud = require('core/cloud');

const updateRefunds = () => ({
  "metadata": {
    "key": tools.random()
  }
});

suite.forElement('payment', 'refunds', (test) => {
  let chargeId;
  before(() => cloud.post(`/hubs/payment/charges`, charge)
    .then(r => chargeId = r.body.id)
  );
  it(`should allow CRU for /hubs/payment/charges/{chargeId}/refunds`, () => {
    let refundId;
    return cloud.post(`/hubs/payment/charges/${chargeId}/refunds`, refund)
      .then(r => refundId = r.body.id)
      .then(r => cloud.get(`${test.api}/${refundId}`))
      .then(r => cloud.patch(`${test.api}/${refundId}`, updateRefunds()))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 } }).get(test.api));
  });
  test.should.return200OnGet();
  test.should.supportNextPagePagination(1);
});
