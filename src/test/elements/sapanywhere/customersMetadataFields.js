'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'customers/metadata/fields', null, (test) => {
  test.should.return200OnGet();
});
