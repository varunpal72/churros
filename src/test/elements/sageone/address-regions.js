'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'address-regions', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  // where clause donot work
});
