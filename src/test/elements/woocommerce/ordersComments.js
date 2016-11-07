'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const order = require('./assets/orders');
const product = require('./assets/products');

const customer = () => ({
  first_name: 'Bill',
  last_name: 'Murray',
  email: tools.randomEmail(),
  password: tools.random()
});

const createOrder = (customerId, productId) => {
  var newOrder = Object.assign({}, order);
  var product = {
    "product_id": productId,
    "quantity": 2
  };
  newOrder.customer_id = customerId;
  newOrder.line_items = [];
  newOrder.line_items.push(product);
  return newOrder;
};

suite.forElement('ecommerce', 'ordersComments', { payload: order, skip: true }, (test) => {
  it('should allow CRUDS for ' + test.api, () => {
    let customerId, productId, orderId;
    return cloud.post('/hubs/ecommerce/customers', customer())
      .then(r => customerId = r.body.id)
      .then(r => cloud.post('/hubs/ecommerce/products', product))
      .then(r => productId = r.body.id)
      .then(r => cloud.post('/hubs/ecommerce/orders', createOrder(customerId, productId)))
      .then(r => orderId = r.body.id)
      .then(r => test.withApi('/hubs/ecommerce/orders/' + orderId+ '/comments').should.supportCruds())
      .then(r => cloud.delete('/hubs/ecommerce/orders/' + orderId))
      .then(r => cloud.delete('/hubs/ecommerce/customers/' + customerId))
      .then(r => cloud.delete('/hubs/ecommerce/products/' + productId));
  });
});
