'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const updateOrders = () => ({
  "metadata": {
    "key": tools.random()
  }
});

suite.forElement('payment', 'orders', (test) => {
  test.should.supportSr();
  it.skip(`should allow Patch for ${test.api}`, () => {
    let orderId;
    return cloud.get(`${test.api}`)
      .then(r => orderId = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${orderId}`,updateOrders()));
  });
});
