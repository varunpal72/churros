'use strict';

const suite = require('core/suite');

suite.forElement('social', 'tags', (test) => {
  test.should.return200OnGet();
});
