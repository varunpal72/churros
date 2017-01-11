'use strict';

const suite = require('core/suite');
const payload = require('./assets/payroll-items');

suite.forElement('humancapital', 'payroll-items', { payload: payload,skip:true }, (test) => {
  test.should.supportRus();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
