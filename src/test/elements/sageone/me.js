'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'me', (test) => {
  test.should.supportS();
  test.should.supportPagination();
});
