'use strict';

const suite = require('core/suite');
const payload = require('./assets/productsCategories');

suite.forElement('ecommerce', 'products-categories', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'name = \'Clothing\'' } }).should.return200OnGet();
});
