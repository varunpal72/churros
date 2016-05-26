'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'account', null, (test) => {
  test.should.return200OnGet();
});
