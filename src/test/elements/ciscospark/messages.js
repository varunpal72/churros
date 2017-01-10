'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');
const tools = require('core/tools');
const cloud = require('core/cloud');
let roomsId;
suite.forElement('collaboration', 'messages', { payload: payload }, (test) => {

it('should allow CRUDS' + test.api, () => {
    let id ;
    return cloud.post('/hubs/collaboration/rooms', { title: tools.random() })
      .then(r => roomsId = r.body.id)
      .then(r => cloud.post(`${test.api}/${roomsId}`,payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.withOptions({ qs: { roomId : roomsId } }).get(`${test.api}`))
      .then(r => cloud.delete(`${test.api}/${id}`))
      .then(r => cloud.delete(`/hubs/collaboration/rooms/${roomsId}`));
  });
});
