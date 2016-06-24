'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'account-types', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
