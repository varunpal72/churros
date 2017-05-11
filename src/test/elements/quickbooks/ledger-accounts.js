'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/ledger-accounts.json`);

suite.forElement('finance', 'ledger-accounts', { payload: payload }, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
});
