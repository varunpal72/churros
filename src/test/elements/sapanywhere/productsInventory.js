'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const productPayload = require('./assets/products');

suite.forElement('ecommerce', 'products', { payload: productPayload }, (test) => {
  productPayload.name = tools.random();
  productPayload.code = tools.randomInt();
  it('should create a product and then CRDS for inventory', () => {
    let productId;
    return cloud.post(test.api, productPayload)
      .then(r => productId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${productId}/inventory/disable`), null)
      .then(r => cloud.patch(`${test.api}/${productId}/inventory/enable`), null);
  });
});
