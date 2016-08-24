'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "projectid": tools.random(),
  "name": tools.random(),
  "projectcategory": "Contract"
});

suite.forElement('finance', 'projects', { payload: payload() }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload());
  });
});
