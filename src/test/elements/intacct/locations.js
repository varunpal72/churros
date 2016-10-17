'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "locationid": tools.randomStr("AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz", 15),
  "name": tools.random(),
  "startdate": {
    "year": "2010",
    "month": "12",
    "day": "1"
  },
  "enddate": {
    "year": "2011",
    "month": "12",
    "day": "1"
  },
  "status": "active",
  "primary": {
    "contactname": "Ecommera"
  },
  "shipto": {
    "contactname": "Ecommera"
  }
});

suite.forElement('finance', 'locations', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload());
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
