'use strict';

const suite = require('core/suite');
 const payload = require('./assets/attributes');
 const cloud = require('core/cloud');


suite.forElement('ecommerce', 'attributes', (test) => {
  it('Testing attributes', () => {
    let fileId;
    return cloud.post('/hubs/ecommerce/products/attributes', payload)
    .then(r => fileId = r.body.product_attribute.id)
    .then(r => cloud.get('/hubs/ecommerce/products/attributes'))
    .then(r => cloud.get('/hubs/ecommerce/products/attributes/' + fileId))
    .then(r => cloud.patch('/hubs/ecommerce/products/attributes/' + fileId, payload))
    .then(r => cloud.delete('/hubs/ecommerce/products/attributes/' + fileId));
  });
});
