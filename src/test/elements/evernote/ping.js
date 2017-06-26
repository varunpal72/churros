'use strict';

const suite = require('core/suite');

suite.forElement('documents', 'ping', (test) => {
  test.should.return200OnGet();
});
