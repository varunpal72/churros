'use strict';

const suite = require('core/suite');

suite.forElement('esignature', 'ping', null, (test) => {
  test.should.return200OnGet();
});