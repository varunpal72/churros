'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const order = require('./assets/orders');
const product = require('./assets/products');
const productApi = '/hubs/ecommerce/products';
const customerApi = '/hubs/ecommerce/customers';

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

suite.forElement('ecommerce', 'orders', { payload: order }, (test) => {
  it('should allow CRUDS for ' + test.api + ', S for ' +
    customerApi + '/{id}/orders and S for ' + productApi + '/{id}/orders', () => {
      let customerId, productId, orderId;
      return cloud.post(customerApi, customer())
        .then(r => customerId = r.body.id)
        .then(r => cloud.post(productApi, product))
        .then(r => productId = r.body.id)
        .then(r => cloud.post(test.api, createOrder(customerId, productId)))
        .then(r => orderId = r.body.id)
        .then(r => cloud.get(test.api + '/' + orderId))
        .then(r => cloud.update(test.api + '/' + orderId, order))
        .then(r => cloud.get(customerApi + '/' + customerId + '/orders'))
        .then(r => cloud.get(productApi + '/' + productId + '/orders'))
        .then(r => cloud.get(test.api))
        .then(r => cloud.delete(test.api + '/' + orderId))
        .then(r => cloud.delete(productApi + '/' + productId))
        .then(r => cloud.delete(customerApi + '/' + customerId));
    });

  test.should.supportPagination();
});
