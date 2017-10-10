'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const calendarsPayload = tools.requirePayload(`${__dirname}/assets/calendars.json`);

suite.forElement('general', 'users/me/calendarList', null, (test) => {
  let calendarId;
  before(() => cloud.post(`/hubs/general/calendars`, calendarsPayload)
  .then(r => calendarId = r.body.id));

  it('should test CRUDS of  /users/me/calendarlist', () => {
  return cloud.cruds(test.api, { "id":calendarId });
  });

  it('should test pagination for users/me/calendarList', () => {
      return cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api)
      .then(r => {
        expect(r.body.length).to.below(2);
      });
  });

  it('should test where for users/me/calendarList', () => {
         return cloud.withOptions({ qs: { where : `minAccessRole='owner'` } }).get(test.api)
      .then(r => {
           expect(r.body.length).to.not.be.empty;
      });
  });
 
  after(() => cloud.delete(`/hubs/general/calendars/${calendarId}`));
});
