'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const cloud = require('core/cloud');
suite.forElement('finance', 'customers', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'accountName=\'churrosTestCustomer\'' } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
