'use strict';

const suite = require('core/suite');

suite.forElement('screening', 'products', (test) => {
  test.should.return200OnGet();
});
