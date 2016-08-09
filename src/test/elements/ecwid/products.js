'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  test.should.supportSr();

  it('it should support PATCH', () => {
    return cloud.get('/hubs/ecommerce/products')
    .then(r => r.body.filter(r => r.id))
    .then(filteredProducts => cloud.patch(`/hubs/ecommerce/products/${filteredProducts[0].id}`, payload));
  });
});
