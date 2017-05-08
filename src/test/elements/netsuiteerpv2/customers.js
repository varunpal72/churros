'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/customers');

suite.forElement('erp', 'customers', { payload: payload }, (test) => {
  payload.firstName = tools.random();
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
  test.should.supportCeqlSearch('id');
  test.withOptions({ qs: { page: 1,
                           pageSize: 5,
                           where : "savedSearchId = '18'"
                         } }).should.return200OnGet();
});
