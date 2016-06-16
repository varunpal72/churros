'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'bankAccounts', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
