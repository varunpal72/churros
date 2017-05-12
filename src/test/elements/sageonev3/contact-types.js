'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'contact-types', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  //where clause donot work
});
