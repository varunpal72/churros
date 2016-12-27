'use strict';

const suite = require('core/suite');

suite.forElement('documents', 'storage', null, (test) => {
  test.should.return200OnGet();
});