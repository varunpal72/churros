'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'products', (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.return400OnPost();
  test.should.supportSr();
});
