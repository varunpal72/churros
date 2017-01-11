'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'custom/fields', (test) => {
  test.should.return200OnGet();
});
