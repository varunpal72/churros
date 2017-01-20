'use strict';

const suite = require('core/suite');
const payload = require('./assets/channels');
const cloud =require('core/cloud');
const messagespayload=require('./assets/messages');

suite.forElement('collaboration', 'channels', { payload: payload }, (test) => {

it(`should allow CS for ${test.api}/:id/messages,RD /messges/:id`, () => {
    let channelId, id;
    return cloud.post(`${test.api}`,payload)
      .then(r => channelId = r.body.id)
      .then(r => cloud.post(`${test.api}/${channelId}/messages`, messagespayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${channelId}/messages`))
      .then(r => cloud.get(`/hubs/collaboration/messages/${id}`))
      .then(r => cloud.delete(`/hubs/collaboration/messages/${id}`))
      .then(r => cloud.delete(`${test.api}/${channelId}`));
  });

});
