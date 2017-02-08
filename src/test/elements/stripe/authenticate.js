'use strict';

const suite = require('core/suite');

suite.forElement('payment', 'authenticate', (test) => {
  test.should.return200OnGet();
});
