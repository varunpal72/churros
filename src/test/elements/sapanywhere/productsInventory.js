'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const productPayload = require('./assets/products');

suite.forElement('ecommerce', 'products', { payload: productPayload, skip: true }, (test) => {
  const build = (overrides) => Object.assign({}, productPayload, overrides);
  const payload = build({ name: tools.random(), code: tools.randomInt() });
  it('should create a product and then CRDS for inventory', () => {
    let productId;
    return cloud.post(test.api, payload)
      .then(r => productId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${productId}/inventory/disable`), null)
      .then(r => cloud.patch(`${test.api}/${productId}/inventory/enable`), null);
  });
});
