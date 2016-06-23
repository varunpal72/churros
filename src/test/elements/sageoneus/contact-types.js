'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'contact-types', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
