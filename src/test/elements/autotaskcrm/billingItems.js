'use strict';

const suite = require('core/suite');
const payload = require('./assets/billingItems');

suite.forElement('crm', 'billing-items', { payload: payload }, (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { where: 'ourCost>=\'1\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
