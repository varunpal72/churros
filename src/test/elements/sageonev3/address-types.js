'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'address-types', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  //where clause do not work
});
