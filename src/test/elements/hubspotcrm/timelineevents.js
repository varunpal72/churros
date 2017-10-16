'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/timelineevents');

suite.forElement('crm', 'timelineeventtypes', (test) => {

  it('should test CRU for /timelineeventtypes/{id}/events ', () => {
    let id = 19073,
      eventId;
    return cloud.post(`${test.api}/${id}/events`, payload)
      .then(r => eventId = payload.id)
      .then(r => cloud.patch(`${test.api}/${id}/events/${eventId}`, payload))
      .then(r => cloud.get(`${test.api}/${id}/events/${eventId}`));
  });

});
