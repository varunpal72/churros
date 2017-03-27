'use strict';

const suite = require('core/suite');
const payload = require('./assets/productsTags');

suite.forElement('ecommerce', 'products-tags', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'name = \'Leather Shoes\'' } }).should.return200OnGet();
});
