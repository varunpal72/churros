'use strict';

const suite = require('core/suite');
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

suite.forElement('finance', 'payments', { payload: payload(), skip: true}, (test) => {
  it(`should allow CRS for ${test.api}`, () => {
    return cloud.crs(test.api, payload());
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
