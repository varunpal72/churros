'use strict';

const suite = require('core/suite');
const payload = require('./assets/productsCategories');

suite.forElement('ecommerce', 'products-categories', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Clothing\'' } }).should.return200OnGet();
});
