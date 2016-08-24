'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "locationid": tools.random(),
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
});
