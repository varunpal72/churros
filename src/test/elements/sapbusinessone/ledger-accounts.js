'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

suite.forElement('erp', 'ledger-accounts', (test) => {
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'AcctCode = \'Accounts Payable\'' } }).should.return200OnGet();
  test.should.supportSr();
});
