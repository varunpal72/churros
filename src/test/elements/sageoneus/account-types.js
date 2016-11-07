'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'account-types', {skip: true}, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
