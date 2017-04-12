'use strict';

const suite = require('core/suite');
const payload = require('./assets/productsAttributes');

suite.forElement('ecommerce', 'products-attributes', { payload: payload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'has_archives = true' } }).should.return200OnGet();
});
