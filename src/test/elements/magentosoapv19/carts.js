'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'carts', (test) => {
  test.withApi(`${test.api}/717`).should.return200OnGet();
});