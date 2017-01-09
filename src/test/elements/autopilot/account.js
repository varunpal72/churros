'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'account', { skip: true }, (test) => {
  test.should.return200OnGet();
});
