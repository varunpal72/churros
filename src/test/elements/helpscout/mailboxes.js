'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'mailboxes', null, (test) => {
  test.should.return200OnGet();
});
