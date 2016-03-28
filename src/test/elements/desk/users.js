'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'users', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
