'use strict';

const suite = require('core/suite');
const payload = require('./assets/ledger-accounts');

suite.forElement('finance', 'ledger-accounts', { payload: payload }, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
});
