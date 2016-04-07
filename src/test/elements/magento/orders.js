'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');
const cloud = require('core/cloud');
const winston = require('winston');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.supportSr();
  it('should support retrieval of order sub-items', () => {
    let orderId;
    return cloud.get(test.api)
    .then(r => {
      if (r.body.length <= 0) {
        return;
      }
      orderId = r.body[0].id;
      return cloud.get(`${test.api}/${orderId}`);
    })
    .then(r => cloud.get(`${test.api}/${orderId}/addresses`))
    .then(r => cloud.get(`${test.api}/${orderId}/items`));
  });
});
