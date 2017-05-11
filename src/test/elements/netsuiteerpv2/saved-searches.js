'use strict';

const suite = require('core/suite');

suite.forElement('erp', 'saved-searches', (test) => {
  test.withOptions({ qs: { objectName: 'customers' } }).should.return200OnGet();
});
