'use strict';

const suite = require('core/suite');

suite.forElement('accounting', 'bank-accounts', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
