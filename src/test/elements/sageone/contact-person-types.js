'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'contact-person-types', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  // where clause donot work
});
