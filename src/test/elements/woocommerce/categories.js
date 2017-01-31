'use strict';

const suite = require('core/suite');
const payload = require('./assets/categories');
const cloud = require('core/cloud');
const tools = require('core/tools');
const api = '/hubs/ecommerce/products/categories';

suite.forElement('ecommerce', 'categories', null, (test) => {
  it(`should allow CRUDS for ${api}`, () => {
    let categoryId;
    return cloud.post(api, payload)
      .then(r => categoryId = r.body.id)
      .then(r => cloud.get(api))
      .then(r => cloud.get(api + '/' + categoryId))
      .then(r => cloud.patch(api + '/' + categoryId, { product_category: { name: tools.random() } }))
      .then(r => cloud.delete(api + '/' + categoryId));
  });
});
