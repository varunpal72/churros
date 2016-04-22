'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const cloud = require('core/cloud');
const tools = require('core/tools');

const productPatch = () => ({
  short_description:"Updated: now they are the best churros ever"
});

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  test.should.supportPagination();
  it('should allow CRUDS for /products', () => {
    let productId;
    return cloud.post(test.api, payload)
      .then(r => productId = r.body['product_id'])
      .then(r => cloud.get(test.api + '/' + productId))
      .then(r => cloud.get(test.api + '?name = \'Delicious Churros\''))
      .then(r => cloud.patch(test.api + '/' + productId, productPatch()))
      .then(r => cloud.delete(test.api + '/' + productId));
  });
});
