'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'accountName=\'churrosTestAccount\'' } }).should.return200OnGet();
  test.should.supportPagination();
});