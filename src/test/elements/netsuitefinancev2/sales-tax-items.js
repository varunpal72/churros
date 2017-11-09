'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'sales-tax-items', (test) => {
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
