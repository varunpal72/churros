'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');

payload.companyName += tools.random();

suite.forElement('erp', 'leads', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
