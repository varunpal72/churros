'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'payment-methods', {skip: false}, (test) => {
  test.should.return200OnGet();
});
