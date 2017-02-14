'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const groupsPayload = require('./assets/groups');

const updatePayload = {
  "description": "All box Users Updated"
};

suite.forElement('documents', 'groups', { payload: groupsPayload }, (test) => {
  it(`should allow CUDS for ${test.api}`, () => {
    let groupId;
    return cloud.post(test.api, groupsPayload)
      .then(r => groupId = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.patch(`${test.api}/${groupId}`, updatePayload))
      .then(() => cloud.delete(`${test.api}/${groupId}`));
  });
});
