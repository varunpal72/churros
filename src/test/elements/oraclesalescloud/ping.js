'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'ping', (test) => {
  test.should.return200OnGet();
});
