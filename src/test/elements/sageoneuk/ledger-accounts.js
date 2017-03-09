'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const accountPayload = (randomName) => ({
  "ledger_name": "churros-" + randomName,
  "display_name": "churros-" + randomName,
  "nominal_code": tools.randomInt(),
  "included_in_chart": true,
  "category_id": 1
});

suite.forElement('sageaccounting', 'ledger-accounts', { payload: accountPayload(tools.randomStr('abcdefghijklmnopqrstuvwxyz0123456789', 10)) }, (test) => {
  test.withOptions({ skip: true }).should.supportCrs();
  test.should.supportPagination();
});
