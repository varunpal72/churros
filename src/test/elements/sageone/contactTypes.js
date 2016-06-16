'use strict';

const suite = require('core/suite');

suite.forElement('sage', 'contactTypes', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
