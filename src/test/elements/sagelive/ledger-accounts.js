'use strict';

const suite = require('core/suite');
const payload = require('./assets/ledger-accounts');
const tools = require('core/tools');

const options = {
  churros: {
    updatePayload: {
      "Name": "Churros " + tools.random(),
    }
  }
};

suite.forElement('sage', 'ledger-accounts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'LastModifiedDate>\'2016-06-20T23:58:03Z\'' } }).should.return200OnGet();
});
