'use strict';

const suite = require('core/suite');

suite.forElement('screening', 'packages', (test) => {
  test.should.return200OnGet();
});
