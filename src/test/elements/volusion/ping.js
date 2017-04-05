'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'ping', (test) => {
  test.should.return200OnGet();
});
