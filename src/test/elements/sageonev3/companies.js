'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'companies', (test) => {
  test.should.supportS();
  test.should.supportPagination();
});
