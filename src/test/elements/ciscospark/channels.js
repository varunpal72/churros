'use strict';

const chakram = require('chakram');
const suite = require('core/suite');
const payload = require('./assets/channels');
const cloud = require('core/cloud');
const messagespayload = require('./assets/messages');
const usersPayload = require('./assets/channelUsers');

suite.forElement('collaboration', 'channels', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        title: 'Churros Test Update'
      }
    }
  };
  test.withOptions(opts).should.supportCruds(chakram.put);
  it(`should allow CS for ${test.api}/:id/messages, RD /messages/:id`, () => {
    let channelId, id;
    return cloud.post(`${test.api}`, payload)
      .then(r => channelId = r.body.id)
      .then(r => cloud.post(`${test.api}/${channelId}/messages`, messagespayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${channelId}/messages`))
      .then(r => cloud.get(`/hubs/collaboration/messages/${id}`))
      .then(r => cloud.delete(`/hubs/collaboration/messages/${id}`))
      .then(r => cloud.delete(`${test.api}/${channelId}`));
  });
  it(`should allow CRUDS for ${test.api}/:id/users`, () => {
    let channelId, id, email;
    let updatedPayload = {
      isModerator: false
    };
    return cloud.post(`${test.api}`, payload)
      .then(r => channelId = r.body.id)
      .then(r => cloud.post(`${test.api}/${channelId}/users`, usersPayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${channelId}/users/${id}`))
      .then(r => email = r.body.personEmail)
      .then(r => cloud.withOptions({ qs: { where: `personEmail='${email}'` } }).get(`${test.api}/${channelId}/users`))
      .then(r => cloud.put(`${test.api}/${channelId}/users/${id}`, updatedPayload))
      .then(r => cloud.delete(`${test.api}/${channelId}/users/${id}`))
      .then(r => cloud.delete(`${test.api}/${channelId}`));
  });
});
