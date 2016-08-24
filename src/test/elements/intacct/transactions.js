'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = (journalid) => ({
  "journalid": journalid,
  "datecreated": {
    "year": "2011",
    "month": "03",
    "day": "07"
  },
  "reversedate": {
    "year": "2016",
    "month": "01",
    "day": "30"
  },
  "description": "From XML API",
  "referenceno": "9876",
  "gltransactionentries": {
    "glentry": [
      {
        "trtype": "credit",
        "amount": "9876",
        "glaccountno": "1400",
        "datecreated": {
          "year": "2011",
          "month": "03",
          "day": "07"
        }
      },
      {
        "trtype": "debit",
        "amount": "9876",
        "glaccountno": "1400",
        "datecreated": {
          "year": "2011",
          "month": "03",
          "day": "07"
        }
      }
    ]
  }
});

suite.forElement('finance', 'transactions', { payload: payload() }, (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    let journalid;
    return cloud.get(test.api)
    .then(r => journalid = r.body[0].journalid)
    .then(r => cloud.crds(test.api, payload(journalid)));
  });
  test.withApi(`/hubs/finance/transactions-entries`).should.return200OnGet();
});
