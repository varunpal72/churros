'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders', { payload: {}, skip: true }, (test) => {
  test.should.supportPagination();
  test.should.return200OnGet();
});
