'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'reports', (test) => {
  test.should.return200OnGet();
});