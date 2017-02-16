'use strict';
const payload = require('./assets/product.json');
const suite = require('core/suite');

suite.forElement('ecommerce', 'products', { payload: payload}, (test) => {
  test.should.supportCrud();
});
