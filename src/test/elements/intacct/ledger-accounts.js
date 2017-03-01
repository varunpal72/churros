'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "glaccountno": "TEST",
  "title": tools.random(),
  "normalbalance": "debit",
  "accounttype": "balancesheet",
  "closingtype": "non-closing account",
  "status": "active",
  "requiredept": "false",
  "requireloc": "false",
  "taxable": "false"
});

suite.forElement('finance', 'ledger-accounts', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload());
  });
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});