'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "departmentid": tools.random(),
  "title": tools.random(),
  "parentid": "10",
  "status": "active"
});
suite.forElement('finance', 'departments', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload())
  });
});
