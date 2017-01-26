'use strict';

const suite = require('core/suite');

suite.forElement('humancapital', 'ping', null, (test) => {
  test.should.return200OnGet();
});
