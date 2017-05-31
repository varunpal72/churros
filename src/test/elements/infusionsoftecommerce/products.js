'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'products', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
