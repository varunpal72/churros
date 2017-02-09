'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'tax-rates', (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ skip: true, qs: { where: 'preferred = \'true\'' } }).should.return200OnGet();
});
