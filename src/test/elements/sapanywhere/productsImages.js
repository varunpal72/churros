'use strict';

const suite = require('core/suite');
const imagePayload = require('./assets/images');
const tools = require('core/tools');
const cloud = require('core/cloud');
const productPayload = require('./assets/products');


imagePayload.fileName = tools.random() + '.png';

suite.forElement('ecommerce', 'products', { payload: productPayload }, (test) => {

  let productId;
  let imageId;
  productPayload.name = tools.random();
  productPayload.code = tools.randomInt();

  it('should create a product and then CRDS for an image', () => {
    return cloud.post(test.api, productPayload)
      .then(r => productId = r.body.id)
      .then(r => cloud.crds(`${test.api}/${productId}/images`, imagePayload))
      .then(r => cloud.get(`${test.api}/${productId}/images`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.post(`${test.api}/${productId}/images`, imagePayload))
      .then(r => imageId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}/images/${imageId}`))
      .then(r => cloud.delete(`${test.api}/${productId}/images/${imageId}`))
      .then(r => cloud.delete(`${test.api}/${productId}`));

  });

});
