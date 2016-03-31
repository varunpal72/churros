'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.supportSr();
});
