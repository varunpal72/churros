'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'account-types', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});