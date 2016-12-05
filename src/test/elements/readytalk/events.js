'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'events', { payload: null}, (test) => {
it('should allow get for events and attendees ', () => {
    let eventId,attendeesId;
    return cloud.withOptions({ qs:{where : "status ='ENDED'"}}).get(`${test.api}`)
      .then(r => eventId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${eventId}`))
      .then(r => cloud.get(`${test.api}/${eventId}/attendees`))
      .then(r => attendeesId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${eventId}/attendees/${attendeesId}/chats`))
      .then(r => cloud.get(`${test.api}/${eventId}/attendees/${attendeesId}`));
 });  
});
