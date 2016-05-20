'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'version', (test) => {
  test.should.return200OnGet();
});
