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
  "note": "Churros Comment",
  "customer_note": false
};

const update = {
  "note": "Updated Churros Comment"
};

suite.forElement('ecommerce', 'ordersComments', { payload: order }, (test) => {
  let commentApi = orderApi + '/';
  it('should allow CRUDS for ' + commentApi + '{id}/comments', () => {
    let customerId, productId, orderId, commentId;
    return cloud.post(customerApi, customer())
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(productApi, product))
      .then(r => productId = r.body.id)
      .then(r => cloud.post(orderApi, createOrder(customerId, productId)))
      .then(r => orderId = r.body.id)
      .then(r => commentApi = commentApi + orderId + '/comments')
      .then(r => cloud.post(commentApi, payload))
      .then(r => commentId = r.body.id)
      .then(r => cloud.get(`${commentApi}/${commentId}`))
      .then(r => cloud.patch(`${commentApi}/${commentId}`, update))
      .then(r => cloud.get(commentApi))
      .then(r => cloud.delete(`${commentApi}/${commentId}`))
      .then(r => cloud.delete(orderApi + '/' + orderId))
      .then(r => cloud.delete(customerApi + '/' + customerId))
      .then(r => cloud.delete(productApi + '/' + productId));
  });
});
