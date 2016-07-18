'use strict';

const suite = require('core/suite');

suite.forElement('accounting', 'contact-types', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
