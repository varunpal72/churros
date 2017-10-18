'use strict';

const suite = require('core/suite');

suite.forElement('employee', 'locations', (test) => {

  test.should.supportPagination();
  test.should.return200OnGet();
});
