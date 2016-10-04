'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders/metadata/fields', null, (test) => {
  test.should.return200OnGet();
});
