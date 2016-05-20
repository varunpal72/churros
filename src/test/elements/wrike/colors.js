'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'colors', (test) => {
  test.should.return200OnGet();
});
