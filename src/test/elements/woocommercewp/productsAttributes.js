'use strict';

const suite = require('core/suite');
const payload = require('./assets/productsAttributes');

suite.forElement('ecommerce', 'products-attributes', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'has_archives = true' } }).should.return200OnGet();
});
