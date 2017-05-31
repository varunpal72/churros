'use strict';

const suite = require('core/suite');

suite.forElement('humancapital', 'saved-searches', (test) => {
  test.withOptions({ qs: { objectName: 'employees' } }).should.return200OnGet();
});
