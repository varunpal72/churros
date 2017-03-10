'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'reports-sales', (test) => {
  test.should.return200OnGet();
});
