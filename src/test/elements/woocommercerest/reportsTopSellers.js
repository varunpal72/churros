'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'reports-top-sellers', (test) => {
  test.should.return200OnGet();
});