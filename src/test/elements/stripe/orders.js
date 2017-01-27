'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/orders');

const updateOrders = () => ({
  "metadata": {
    "key": tools.random()
  }
});

suite.forElement('payment', 'orders', (test) => {
  test.should.supportSr();
  it(`should allow CU for ${test.api}`, () => {
    let orderId;
    return cloud.post(`${test.api}`, payload)
      .then(r => orderId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${orderId}`, updateOrders()))
      .then(r => cloud.withOptions({ qs: { where: `created >= 1464041554` } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 } }).get(test.api));
  });
  test.should.supportNextPagePagination(1);
});
