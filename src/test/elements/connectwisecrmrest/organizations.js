'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const orgPayload = build({ identifier: tools.randomStr('abcdefghijklmnopqrstuvwxyz0123456789', 10) });
const whereOrgPayload = build({ identifier: tools.randomStr('abcdefghijklmnopqrstuvwxyz0123456789', 10) });

const organizationUpdate = {
  "name": "abc",
  "billToCompany": {
    "id": "644"
  }
};

suite.forElement('crm', 'organizations', { payload: whereOrgPayload }, (test) => {
  test.should.supportPagination('id');
  test.should.supportCeqlSearch('id');
  it(`should support CRUDS for ${test.api}`, () => {
    let organizationId;
    return cloud.post(test.api, orgPayload)
      .then(r => organizationId = r.body.id)
      .then(r => cloud.get(`${test.api}/${organizationId}`))
      .then(r => cloud.get(`${test.api}/${organizationId}`))
      .then(r => cloud.patch(`${test.api}/${organizationId}`, organizationUpdate))
      .then(r => cloud.put(`${test.api}/${organizationId}`, orgPayload))
      .then(r => cloud.delete(`${test.api}/${organizationId}`));
  });
});
