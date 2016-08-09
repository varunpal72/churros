'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'shipments', (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
});
