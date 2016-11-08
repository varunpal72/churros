'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'invoices', (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
});
