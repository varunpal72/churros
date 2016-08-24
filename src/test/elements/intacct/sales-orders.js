'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const payload = () => ({
  "dateposted": {
    "month": "08",
    "year": 2010,
    "day": 30
  },
  "datedue": {
    "month": "08",
    "year": 2010,
    "day": 30
  },
  "transactionstate": "Pending",
  "sotransitems": {
    "sotransitem": [
      {
        "revrecenddate": {
          "month": "08",
          "year": 2011,
          "day": 29
        },
        "quantity": 1,
        "docid": "Sales Order-SO0001",
        "line_no": 0,
        "recordno": 42,
        "itemid": 900,
        "trx_value": 100,
        "itemdesc": "1 Year software license",
        "unit": "Each",
        "totalamount": 100,
        "trx_price": 100,
        "price": 100,
        "revrecstartdate": {
          "month": "08",
          "year": 2010,
          "day": 30
        },
        "retailprice": 100,
        "exchrate": 1,
        "currency": "USD",
        "dochdrno": 31
      }
    ]
  },
  "basecurr": "USD",
  "datecreated": {
    "month": "08",
    "year": 2010,
    "day": 30
  },
  "transactiontype": "Sales Order",
  "transactionid": "Sales Order-SO0001",
  "termname": "N30",
  "whenmodified": "04/23/2016 03:21:50",
  "billto": {
    "contactname": "America's Gardening Resource"
  },
  "customerid": "AGR001",
  "exchrate": 1,
  "paymentstatus": "Open",
  "documentnumber": "SO0001",
  "currency": "USD",
  "shipto": {
    "contactname": "America's Gardening Resource"
  }
});

suite.forElement('finance', 'sales-orders', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload());
  });
  test.should.supportPagination();
});
