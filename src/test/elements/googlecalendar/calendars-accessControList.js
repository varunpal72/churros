'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/calendars-accessControList.json`);
const calendarsPayload = tools.requirePayload(`${__dirname}/assets/calendars.json`);

suite.forElement('general', 'calendars', { payload: payload }, (test) => {
  let calendarId;
  before(() => cloud.post(test.api, calendarsPayload)
  .then(r => calendarId = r.body.id));

  it('should test CRUDS of  AccessControlList', () => {
  return cloud.cruds(`${test.api}/${calendarId}/AccessControlList`, payload)
  });

  it('should test pagination for AccessControlList', () => {
      return cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${calendarId}/AccessControlList`)
      .then(r => {
        expect(r.body.length).to.below(2);
      });
  });

  it('should test where for AccessControlList', () => {
         return cloud.withOptions({ qs: { where : `showDeleted='true'` } }).get(`${test.api}/${calendarId}/AccessControlList`)
      .then(r => {
           expect(r.body.length).to.not.be.empty;
      });
  });	   
 
  after(() => cloud.delete(`${test.api}/${calendarId}`));
});
