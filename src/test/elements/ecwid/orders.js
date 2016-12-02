'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'orders', { payload: payload, skip: true }, (test) => {
  test.should.supportSr();

  it('it should support PATCH', () => {
    return cloud.get('/hubs/ecommerce/orders')
    .then(r => r.body.filter(r => r.id))
    .then(filteredOrders => cloud.patch(`/hubs/ecommerce/orders/${filteredOrders[0].id}`, payload));
  });

  it('it should support GET payments by order id', () => {
    return cloud.get('/hubs/ecommerce/orders')
    .then(r => r.body.filter(r => r.id))
    .then(filteredOrders => cloud.get(`/hubs/ecommerce/orders/${filteredOrders[0].id}/payments`));
  });

  it('it should support GET refunds by order id', () => {
    return cloud.get('/hubs/ecommerce/orders')
    .then(r => r.body.filter(r => r.id))
    .then(filteredOrders => cloud.get(`/hubs/ecommerce/orders/${filteredOrders[0].id}/refunds`));
  });
});
