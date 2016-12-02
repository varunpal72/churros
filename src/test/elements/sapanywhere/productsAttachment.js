'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const productPayload = require('./assets/products');

suite.forElement('ecommerce', 'products', { payload: productPayload, skip: true }, (test) => {
  it('should create a product and then CRDS for an attachment', () => {
    let path = __dirname + '/assets/temp.png';
    let productId, attachmentId;
    const build = (overrides) => Object.assign({}, productPayload, overrides);
    const payload = build({ code: tools.randomInt() });
    return cloud.post(test.api, payload)
      .then(r => productId = r.body.id)
      .then(r => cloud.postFile(`${test.api}/${productId}/attachments`, path))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}/attachments`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.get(`${test.api}/${productId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${productId}/attachments/${attachmentId}`));
  });
});
