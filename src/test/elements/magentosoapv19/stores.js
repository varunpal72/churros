'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'stores', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
