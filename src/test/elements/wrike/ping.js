'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'ping', (test) => {
  test.should.return200OnGet();
});
