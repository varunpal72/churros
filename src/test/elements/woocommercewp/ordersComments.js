'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/orders');
const commentsPayload = require('./assets/comments');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  it('should create a order and then CRDS for a comments', () => {
    let orderId;
    return cloud.post(test.api, payload)
      .then(r => orderId = r.body.id)
      .then(r => cloud.crds(`${test.api}/${orderId}/comments`, commentsPayload))
      .then(r => cloud.delete(`${test.api}/${orderId}`));
  });
});
