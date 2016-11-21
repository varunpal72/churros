'use strict';

const suite = require('core/suite');
const payload = require('./assets/ledger-accounts');
const tools = require('core/tools');

suite.forElement('sageaccounting', 'ledger-accounts', { payload: payload, skip: true }, (test) => {
  var options = {
    churros: { updatePayload: { "Name": "Churros " + tools.random() } }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'LastModifiedDate>\'2016-06-20T23:58:03Z\'' } }).should.return200OnGet();
});
