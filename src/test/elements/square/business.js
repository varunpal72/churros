'use strict';

const suite = require('core/suite');

suite.forElement('employee', 'business', (test) => {
  test.should.supportPagination();
  test.should.return200OnGet();
});