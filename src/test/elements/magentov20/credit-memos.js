'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'credit-memos', (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
});
