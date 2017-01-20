'use strict';

const suite = require('core/suite');
const cloud =require('core/cloud');
const payload = require('./assets/channels');
const usersPayload=require('./assets/channelUsers');

suite.forElement('collaboration', 'channels', { payload: payload }, (test) => {
 
it(`should allow CRUDS for ${test.api}/:id/users`, () => {
    let channelId, id,email;
    let updatedPayload = {
    isModerator: false
  };
    return cloud.post(`${test.api}`,payload)
      .then(r => channelId = r.body.id)
      .then(r => cloud.post(`${test.api}/${channelId}/users`, usersPayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${channelId}/users/${id}`))
      .then(r => email = r.body.personEmail)
      .then(r => cloud.withOptions({ qs: { where:`email='${email}'`} }).get(`${test.api}/${channelId}/users`))
      .then(r => cloud.put(`${test.api}/${channelId}/users/${id}`,updatedPayload))
      .then(r => cloud.delete(`${test.api}/${channelId}/users/${id}`))
      .then(r => cloud.delete(`${test.api}/${channelId}`));
  });
});
