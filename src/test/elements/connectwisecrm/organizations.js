'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');

suite.forElement('crm', 'organizations', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: 'companyName=\'Churros Company\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
