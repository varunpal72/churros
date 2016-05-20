'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'colors', (test) => {
  test.should.return200OnGet();
});
