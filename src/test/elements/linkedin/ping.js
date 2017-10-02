'use strict';

const suite = require('core/suite');

suite.forElement('social', 'ping', (test) => {
  test.should.return200OnGet();
});
