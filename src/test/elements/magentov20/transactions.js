'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'transactions', (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
});
