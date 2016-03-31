'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'shops', (test) => {
  test.should.return200OnGet();
});
