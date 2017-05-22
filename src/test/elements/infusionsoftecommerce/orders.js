'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
