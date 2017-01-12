'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'ledger-accounts', (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'isInactive = \'false\'' } }).should.return200OnGet();
});
