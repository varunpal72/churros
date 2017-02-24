'use strict';

const suite = require('core/suite');

suite.forElement('payment', 'ping', (test) => {
  test.should.return200OnGet();
});
