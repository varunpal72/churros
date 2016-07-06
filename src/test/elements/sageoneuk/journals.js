'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = (ref) => ({
    "reference": "churros-" + ref,
    "date": "2016-06-14",
    "description": "Big Nasty Test",
    "journal_lines": [
    {
      "credit": 50,
      "debit": 0,
      "details": "details",
      "ledger_account": {
        "nominal_code": 1
      }
    },
    {
      "credit": 0,
      "debit": 50,
      "details": "details",
      "ledger_account": {
        "nominal_code": 1
      }
    }]
});

suite.forElement('sage', 'journals', { payload: payload(tools.random()) }, (test) => {
  test.should.return200OnPost();
});
