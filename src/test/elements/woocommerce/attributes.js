'use strict';

const suite = require('core/suite');
const payload = require('./assets/attributes');
const cloud = require('core/cloud');
const tools = require('core/tools');
const api = '/hubs/ecommerce/products/attributes';

suite.forElement('ecommerce', 'attributes', null, (test) => {
  it(`should allow CRUDS for ${api}`, () => {
    let attributeId;
    return cloud.post(api, payload)
      .then(r => attributeId = r.body.id)
      .then(r => cloud.get(api))
      .then(r => cloud.get(api + '/' + attributeId))
      .then(r => cloud.patch(api + '/' + attributeId, { product_attribute: { name: tools.random() } }))
      .then(r => cloud.delete(api + '/' + attributeId));
  });
});
