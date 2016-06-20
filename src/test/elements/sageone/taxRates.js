'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'taxRates', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
