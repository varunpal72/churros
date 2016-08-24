'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
 "classid": tools.random(),
 "name": "Churros tests"
});

suite.forElement('finance', 'classes', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload())
  });
});
