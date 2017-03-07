'use strict';

const suite = require('core/suite');
const payload = require('./assets/payroll-items');

suite.forElement('humancapital', 'payroll-items', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
});
