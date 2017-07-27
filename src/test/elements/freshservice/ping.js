'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'ping', (test) => {
  test.should.return200OnGet();
});