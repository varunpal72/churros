'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const productPayload = require('./assets/products');

suite.forElement('ecommerce', 'products', { payload: productPayload }, (test) => {
  productPayload.name = tools.random();
  productPayload.code = tools.randomInt();
  it('should create a product and then CRDS for an image', () => {
    let productId,imageId;
    let path = __dirname + '/assets/temp.png';
    return cloud.post(test.api, productPayload)
      .then(r => productId = r.body.id)
      .then(r => cloud.postFile(`${test.api}/${productId}/images`, path))
      .then(r => imageId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}/images/${imageId}`))
      .then(r => cloud.get(`${test.api}/${productId}/images`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.delete(`${test.api}/${productId}/images/${imageId}`))
      .then(r => cloud.delete(`${test.api}/${productId}`));
  });
});
