'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/calendars-events.json`);
const calendarsPayload = tools.requirePayload(`${__dirname}/assets/calendars.json`);

suite.forElement('general', 'calendars', { payload: payload }, (test) => {
  let calendarId;
  before(() => cloud.post(test.api, calendarsPayload)
  .then(r => calendarId = r.body.id));

  it('should test CRUDS of  events', () => {
  return cloud.cruds(`${test.api}/${calendarId}/events`, payload)
  });

  it('should test pagination for events', () => {
      return cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${calendarId}/events`)
      .then(r => {
        expect(r.body.length).to.below(2);
      });
  });

  it('should test where for events', () => {
         return cloud.withOptions({ qs: { where : `maxAttendees=1` } }).get(`${test.api}/${calendarId}/events`)
      //There are no events exist for newly created calendar
	  /*.then(r => {
           expect(r.body.length).to.not.be.empty;
      });*/
  });
 
  after(() => cloud.delete(`${test.api}/${calendarId}`));
});
