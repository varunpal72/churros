'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'bank-accounts', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});