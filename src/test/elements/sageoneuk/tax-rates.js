'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'tax-rates', null, (test) => {
  test.should.supportPagination();
  test.should.supportSr();
});