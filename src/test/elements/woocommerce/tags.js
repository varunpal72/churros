'use strict';

const suite = require('core/suite');
const payload = require('./assets/tags');
const cloud = require('core/cloud');
const tools = require('core/tools');
const api = '/hubs/ecommerce/products/tags';

suite.forElement('ecommerce', 'tags', null, (test) => {
  it(`should allow CRUDS for ${api}`, () => {
    let tagId;
    return cloud.post(api, payload)
      .then(r => tagId = r.body.id)
      .then(r => cloud.get(api))
      .then(r => cloud.get(api + '/' + tagId))
      .then(r => cloud.patch(api + '/' + tagId, { product_tag: { description: tools.random() } }))
      .then(r => cloud.delete(api + '/' + tagId));
  });
});
