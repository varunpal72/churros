'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/ledger-accounts');

suite.forElement('erp', 'ledger-accounts', null, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'isInactive = \'false\'' } }).should.return200OnGet();
});
