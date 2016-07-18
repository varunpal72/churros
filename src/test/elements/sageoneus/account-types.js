'use strict';

const suite = require('core/suite');

suite.forElement('accounting', 'account-types', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
