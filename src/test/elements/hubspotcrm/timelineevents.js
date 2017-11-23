'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/timelineevents');

suite.forElement('crm', 'timeline-event-types', {skip: true}, (test) => {

  it('should test CRU for /timeline-event-types/{id}/events ', () => {
    let id,eventId;
    return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.post(`${test.api}/${id}/events`, payload))
      .then(r => eventId = payload.id)
      .then(r => cloud.patch(`${test.api}/${id}/events/${eventId}`, payload))
      .then(r => cloud.get(`${test.api}/${id}/events/${eventId}`));
  });

});
