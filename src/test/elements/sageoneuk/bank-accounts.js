'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'bank-accounts', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
