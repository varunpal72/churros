'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const accountPayload = (randomName, code) => ({
  "ledger_name": "churros-" + randomName,
  "display_name": "churros-" + randomName,
  "nominal_code": code,
  "included_in_chart": true,
  "category_id": 1
});

const journalPayload = (randomName, code) => ({
  "reference": "churros-" + randomName,
  "date": "2016-06-14",
  "description": "Fluffy, tasty churros",
  "journal_lines": [
    {
      "credit": 50,
      "debit": 0,
      "details": "details",
      "ledger_account": {
        "nominal_code": code
      }
    },{
      "credit": 0,
      "debit": 50,
      "details": "details",
      "ledger_account": {
        "nominal_code": code
      }
    } ]
});

suite.forElement('sage', 'journals', null, (test) => {
  let random = tools.random();
  let randomInt = tools.randomInt();
  it('should create a ledger-account and allow a journal post for that account', () => {
    return cloud.post('/hubs/sage/ledger-accounts', accountPayload(random, randomInt))
      .then(r => cloud.post(test.api, journalPayload(random, randomInt)));
  });
});
