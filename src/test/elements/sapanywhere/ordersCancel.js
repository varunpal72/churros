'use strict';

const suite = require('core/suite');

const cloud = require('core/cloud');
const ordersPayload = require('./assets/orders');


suite.forElement('ecommerce', 'orders', { payload: ordersPayload }, (test) => {

  let orderId;
  it('should create an order and then cancel it', () => {
    return cloud.post(test.api, ordersPayload)
      .then(r => orderId = r.body.id)
      .then(r => cloud.post(`${test.api}/${orderId}/cancel`));
  });

});
