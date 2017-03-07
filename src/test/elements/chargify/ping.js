'use strict';

const suite = require('core/suite');

suite.forElement('payment', 'ping', null, (test) => {
  test.should.return200OnGet();
});
