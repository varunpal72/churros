'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/ledger-accounts');
const build = (overrides) => Object.assign({}, payload, overrides);
const ledgerAccounts = build({ name: tools.random() });

suite.forElement('finance', 'ledger-accounts', { payload: ledgerAccounts, skip: false }, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
});
