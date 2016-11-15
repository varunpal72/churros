'use strict';

const suite = require('core/suite');
 const payload = require('./assets/categories');
 const cloud = require('core/cloud');


suite.forElement('ecommerce', 'categories', {skip: true}, (test) => {
  it('Testing categories', () => {

    let fileId;
    return cloud.post('/hubs/ecommerce/products/categories', payload)
    .then(r => fileId = r.body.product_category.id)
    .then(r => cloud.get('/hubs/ecommerce/products/categories'))
    .then(r => cloud.get('/hubs/ecommerce/products/categories/' + fileId))
    .then(r => cloud.patch('/hubs/ecommerce/products/categories/' + fileId, payload))
    .then(r => cloud.delete('/hubs/ecommerce/products/categories/' + fileId));
  });
});
