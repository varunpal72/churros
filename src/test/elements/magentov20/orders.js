'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const productPayload = require('./assets/products');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', (test) => {
  test.withApi(`/hubs/ecommerce/orders-items`).should.return200OnGet();
  test.should.supportPagination();

  it(`should allow CRUDS for ${test.api}`, () => {
    let attributeSetId, sku, orderId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => {
        attributeSetId = r.body[0].id;
        productPayload.product.attribute_set_id = attributeSetId;
      })
      .then(r => cloud.post(`/hubs/ecommerce/products`, productPayload))
      .then(r => {
        sku = r.body.sku;
        payload.cartItem.sku = sku;
      })
      .then(r => cloud.post(test.api, payload))
      .then(r => orderId = r.body.id)
      .then(r => cloud.get(`${test.api}/${orderId}`))
      .then(r => cloud.get(test.api))
      // .then(r => cloud.put(`${test.api}/${orderId}`, payload)) @tylertoth - need to get payload
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`))
      .then(r => cloud.delete(`${test.api}/${orderId}`));;
  });
});
