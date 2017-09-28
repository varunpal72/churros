'use strict';
const chakram = require('chakram');
const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/groups');
const channelPayload = require('./assets/channels');
const usersPayload = require('./assets/channelUsers');

suite.forElement('collaboration', 'groups', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        name: 'Churros Team Update'
      }
    }
  };
  test.withOptions(opts).should.supportCruds(chakram.put);

  it(`should allow CS for ${test.api}/:id/channels`, () => {
    let groupId;
    return cloud.post(`${test.api}`, payload)
      .then(r => groupId = r.body.id)
      .then(r => cloud.post(`${test.api}/${groupId}/channels`, channelPayload))
      .then(r => cloud.get(`${test.api}/${groupId}/channels`))
      .then(r => cloud.delete(`${test.api}/${groupId}`));
  });
  it(`should allow CRUDS for ${test.api}/:id/users`, () => {
    let groupId, id;
    let userUpdatedPayload = {
      isModerator: false
    };
    return cloud.post(test.api, payload)
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
