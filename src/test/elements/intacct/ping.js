'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'ping', null, (test) => {
  test.should.return200OnGet();
});