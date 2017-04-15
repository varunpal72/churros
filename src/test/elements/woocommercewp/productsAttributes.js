'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const payload = require('./assets/productsAttributes');

suite.forElement('ecommerce', 'products-attributes', { payload: payload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
});
