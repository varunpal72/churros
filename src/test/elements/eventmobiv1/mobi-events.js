'use strict';

const tools = require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/mobi-events');
const itemsPayload = require('./assets/mobiEventsSectionsItems');

suite.forElement('general', 'mobi-events', { payload: payload }, (test) => {

  // Relying on this data already be present
  let eventName = 'lauraevent1';
  let attendeesSectionId = 165533;

  it('should allow RU for /mobi-events/:id', () => {
    return cloud.put(`/hubs/event-conferencing/mobi-events/${eventName}`, payload)
      .then(r => cloud.get(`hubs/event-conferencing/mobi-events/${eventName}`));
  });

  test.withApi(`/hubs/event-conferencing/mobi-events/${eventName}/sections`).should.supportSr();

  itemsPayload.attendee_email =  tools.randomEmail();
  test.withApi(`/hubs/event-conferencing/mobi-events/${eventName}/sections/${attendeesSectionId}/items`)
      .withJson(itemsPayload)
      .should.supportCrs();

});
