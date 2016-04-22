'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
 const payload = require('./assets/tags');
 const cloud = require('core/cloud');


suite.forElement('ecommerce', 'tags', (test) => {
  it('Testing tags', () => {

    let fileId;
    return cloud.post('/hubs/ecommerce/products/tags', payload)
    .then(r => fileId = r.body.product_tag.id)
    .then(r => cloud.get('/hubs/ecommerce/products/tags'))
    .then(r => cloud.get('/hubs/ecommerce/products/tags/' + fileId))
    .then(r => cloud.patch('/hubs/ecommerce/products/tags/' + fileId, payload))
    .then(r => cloud.delete('/hubs/ecommerce/products/tags/' + fileId))
  })
});
