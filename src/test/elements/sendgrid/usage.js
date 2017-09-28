'use strict';

const suite = require('core/suite');

suite.forElement('messaging', 'usage', (test) => {
  test.should.return200OnGet();
});
