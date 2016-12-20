'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'users', null, (test) => {
  test.should.return200OnGet();
});