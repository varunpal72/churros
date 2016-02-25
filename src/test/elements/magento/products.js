'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');

suite.forElement('ecommerce', 'products', null, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.return400OnPost();
  test.should.supportSr();

});