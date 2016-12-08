'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'ledger-accounts', {skip: false}, (test) => {
  test.should.return200OnGet();
});
