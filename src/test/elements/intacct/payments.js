'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "customerid": "AGR001",
  "paymentamount": "1234.56",
  "bankaccountid": "CHK-WFB0004",
  "refid": "tmPay001",
  "datereceived": {
    "year": "2016",
    "month": "08",
    "day": "12"
  },
  "paymentmethod": "Cash"
});

suite.forElement('finance', 'payments', { payload: payload() }, (test) => {
  it(`should allow CRS for ${test.api}`, () => {
    return cloud.crs(test.api, payload())
  });
});
