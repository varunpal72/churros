'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'ping', { skip: true }, (test) => {
  test.should.return200OnGet();
});
