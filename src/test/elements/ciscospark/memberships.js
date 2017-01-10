'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/memberships');
suite.forElement('collaboration', 'memberships', { payload: payload }, (test) => {
  const updatePayload = {
    isModerator: false
  };

  it('should allow CRUDS' + test.api, () => {
    let roomsId, id;
    return cloud.post('/hubs/collaboration/rooms', { title: 'churross tmp account' })
      .then(r => roomsId = r.body.id)
      .then(r => payload.roomId = roomsId)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.put(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${id}`))
      .then(r => cloud.delete(`/hubs/collaboration/rooms/${roomsId}`));
  });
});
