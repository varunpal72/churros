'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'customers/metadata/fields', {skip: true}, (test) => {
  test.should.return200OnGet();
});
