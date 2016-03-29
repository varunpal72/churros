'use strict';

const suite = require('core/suite');
const payload = require('./assets/members');
const cloud = require('core/cloud');

// member is unsuspended twice to make sure it's in a state where it can be tested next time.
suite.forElement('documents', 'members', { payload: payload }, (test) => {
  it('should support CRUDS for members', () => {
    let memberId;
    return cloud.post(test.api, payload)
      .then(r => memberId = r.body.complete[0].profile.team_member_id)
      .then(r => cloud.delete(`${test.api}/${memberId}`))
      .then(r => cloud.get(test.api))
      .then(r => memberId = r.body[r.body.length - 1].profile.team_member_id)
      .then(r => cloud.get(`${test.api}/${memberId}`))
      .then(r => cloud.patch(`${test.api}/${memberId}/suspend/false`))
      .then(r => cloud.patch(`${test.api}/${memberId}/unsuspend`))
      .then(r => cloud.patch(`${test.api}/${memberId}/suspend/true`))
      .then(r => cloud.patch(`${test.api}/${memberId}/unsuspend`))
  });
});
