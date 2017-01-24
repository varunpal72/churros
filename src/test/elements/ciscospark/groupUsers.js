'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');
const usersPayload = require('./assets/channelUsers');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'groups', { payload: payload }, (test) => {
  it(`should allow CRUDS for ${test.api}/:id/users`, () => {
    let groupId, id;
    let userUpdatedPayload = {
      isModerator: false
    };
    return cloud.post(`${test.api}`, payload)
      .then(r => groupId = r.body.id)
      .then(r => cloud.post(`${test.api}/${groupId}/users`, usersPayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${groupId}/users/${id}`))
      .then(r => cloud.get(`${test.api}/${groupId}/users`))
      .then(r => cloud.put(`${test.api}/${groupId}/users/${id}`, userUpdatedPayload))
      .then(r => cloud.delete(`${test.api}/${groupId}/users/${id}`))
      .then(r => cloud.delete(`${test.api}/${groupId}`));
  });
});