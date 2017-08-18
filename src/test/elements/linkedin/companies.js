'use strict';

const suite = require('core/suite');

suite.forElement('social', 'companies', (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
});
