'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'ledger-accounts', {skip: true}, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'ledger_account_type=1' } }).should.return200OnGet();
  test.withApi(`${test.api}/types`).should.return200OnGet();
});
