'use strict';

const suite = require('core/suite');
const attachmentPayload = require('./assets/attachment');
const tools = require('core/tools');
const cloud = require('core/cloud');
const productPayload = require('./assets/products');

suite.forElement('ecommerce', 'products', { payload: productPayload }, (test) => {
  let productId;
  attachmentPayload.name = tools.random() + '.png';
  productPayload.name = tools.random();
  productPayload.code = tools.randomInt();
  it('should create a product and then CRDS for an attachment', () => {
    return cloud.post(test.api, productPayload)
      .then(r => productId = r.body.id)
      .then(r => cloud.crds(`${test.api}/${productId}/attachments`, attachmentPayload))
      .then(r => cloud.get(`${test.api}/${productId}/attachments`), { qs: { page: 1, pageSize: 1 } });
  });
});
