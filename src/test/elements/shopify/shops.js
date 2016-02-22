'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'shops', null, (test) => {
  test.should.return200OnGet();
});
