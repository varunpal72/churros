'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "customerid": "TSY003",
  "datecreated": {
    "year": "2014",
    "month": "10",
    "day": "10"
  },
  "dateposted": {
    "year": "2015",
    "month": "10",
    "day": "10"
  },
  "datedue": {
    "year": "2016",
    "month": "10",
    "day": "10"
  },
  "action": "Draft",
  "invoiceno": tools.random(),
  "ponumber": "2480877",
  "description": "Invoice",
  "currency": "USD",
  "exchrate": "0.875",
  "customfields": {
    "customfield": [
      {
        "customfieldname": "TESTDATer1",
        "customfieldvalue": "12/10/2001"
      },
      {
        "customfieldname": "TESTTEXTer1",
        "customfieldvalue": "CustomFieldTexter1"
      }
    ]
  },
  "invoiceitems": {
    "lineitem": [
      {
        "glaccountno": "4000",
        "amount": "3133",
        "departmentid": "10",
        "customfields": {
          "customfield": [
            {
              "customfieldname": "TESTDATer2",
              "customfieldvalue": "12/10/2002"
            },
            {
              "customfieldname": "TESTTEXTer2",
              "customfieldvalue": "CustomFieldTextLineItemer2"
            }
          ]
        }
      },
      {
        "glaccountno": "4000",
        "amount": "40",
        "departmentid": "10",
        "customfields": {
          "customfield": [
            {
              "customfieldname": "TESTDATEer3",
              "customfieldvalue": "12/10/2003"
            },
            {
              "customfieldname": "TESTTEXTer4",
              "customfieldvalue": "CustomFieldTextLineItemer4"
            }
          ]
        }
      }
    ]
  }
});

const customer = () => ({
  "name": tools.random(),
  "deliveryoptions": {
    "deliveryoption": "print"
  },
  "customerid": tools.random(),
  "primary": {
      "contactname": "Anita Anderson"
  },
  "billto": {
      "contactname": "Anita Anderson"
  },
  "shipto": {
      "contactname": "Anita Anderson"
  },
  "contactinfo": {
      "contactname": "Anita Anderson"
  }
});

suite.forElement('finance', 'invoices', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload())
  });
});
