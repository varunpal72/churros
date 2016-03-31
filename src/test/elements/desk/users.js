'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'users', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
