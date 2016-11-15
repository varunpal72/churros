'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/events');

suite.forElement('general', 'events', { payload: payload }, (test) => {
it('should allow Sr /events ,Sr /events/attendees   ', () => {
    let eventId,attendeesId;
    return cloud.get(test.api)
      .then(r => eventId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${eventId}`))
      .then(r => cloud.get(`${test.api}/${eventId}/attendees`))
      .then(r => attendeesId = r.body[1].id)
      .then(r => cloud.get(`${test.api}/${eventId}/attendees/${attendeesId}/chats`))
      .then(r => cloud.get(`${test.api}/${eventId}/attendees/${attendeesId}`));
 });  
});
