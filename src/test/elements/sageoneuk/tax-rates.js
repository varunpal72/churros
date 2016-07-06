'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'tax-rates', null, (test) => {
  test.should.supportPagination();
  test.should.supportSr();
});
