'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/bills');

payload.tranId = tools.random();
payload.externalId += tools.random();

suite.forElement('finance', 'bills', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
