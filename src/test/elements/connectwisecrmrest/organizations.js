'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');
const cloud = require('core/cloud');
const organizationUpdate = () => ({
  "identifier": "test_uChurros",
  "name": "abc",
  "billToCompany":{
    "id":"644"
  }
});

suite.forElement('crm', 'organizations', { payload: payload }, (test) => {
  test.should.supportPagination();
  it(`should support CRUDS for organizations`, () => {
    let organizationId;
    return cloud.post(test.api, payload)
      .then(r => organizationId = r.body.id)
      .then(r => cloud.get(`${test.api}/${organizationId}`))
      .then(r => cloud.get(`${test.api}/${organizationId}`))
      .then(r => cloud.patch(`${test.api}/${organizationId}`, organizationUpdate()))
      .then(r => cloud.put(`${test.api}/${organizationId}`, payload))
      .then(r => cloud.delete(`${test.api}/${organizationId}`));
  });
});
