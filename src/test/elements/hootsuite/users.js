'use strict';

const suite = require('core/suite');

suite.forElement('social', 'users', (test) => {
  test.should.supportSr()
  test.should.supportPagination();
});
