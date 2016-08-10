'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'accounts', (test) => {
  test.should.return200OnGet();
});
