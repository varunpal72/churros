'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const order = require('./assets/orders');
const product = require('./assets/products');
const customerApi = '/hubs/ecommerce/customers';
const productApi = '/hubs/ecommerce/products';
const orderApi = '/hubs/ecommerce/orders';

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

const payload = {
  "order_refund": {
    "amount": "10"
  }
};

const update = {
  "order_refund": {
    "reason": "faulty product"
  }
};

suite.forElement('ecommerce', 'ordersRefunds', { payload: order }, (test) => {
  let refundApi = orderApi + '/';
  it('should allow CRUDS paginating with page and pageSize for ' + refundApi + '{id}/refunds', () => {
    let customerId, productId, orderId, refundId;
    return cloud.post(customerApi, customer())
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(productApi, product))
      .then(r => productId = r.body.id)
      .then(r => cloud.post(orderApi, createOrder(customerId, productId)))
      .then(r => orderId = r.body.id)
      .then(r => refundApi = refundApi + orderId + '/refunds')
      .then(r => cloud.post(refundApi, payload))
      .then(r => refundId = r.body.id)
      .then(r => cloud.get(`${refundApi}/${refundId}`))
      .then(r => cloud.patch(`${refundApi}/${refundId}`, update))
      .then(r => cloud.get(refundApi))
      .then(r => cloud.get(refundApi, { qs: { page: 1, pageSize: 1 } }))
      .then(r => cloud.delete(`${refundApi}/${refundId}`))
      .then(r => cloud.delete(orderApi + '/' + orderId))
      .then(r => cloud.delete(customerApi + '/' + customerId))
      .then(r => cloud.delete(productApi + '/' + productId));
  });
});
