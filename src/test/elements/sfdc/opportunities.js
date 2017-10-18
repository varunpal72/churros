'use strict';

//dependencies at the top
const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
//how to import payloads
const payload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);
const activities = tools.requirePayload(`${__dirname}/assets/activities.json`);
const notes = tools.requirePayload(`${__dirname}/assets/notes.json`);

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');//search opportunities by id
  test.should.supportCruds();
  test.should.return404OnGet('0');//should not find opportunity with id of '0'

  //'it' statements to test sfdc specifc issues
  it('should allow CRUDS for /hubs/crm/opportunities/:id/activities', () => {
    let opportunityId;
    return cloud.post(test.api, payload)
      .then(r => opportunityId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${opportunityId}/activities`, activities))
      .then(r => cloud.delete(`${test.api}/${opportunityId}`));
  });
  it('should allow CRUDS for /hubs/crm/opportunities/:id/notes', () => {
    let opportunityId;
    return cloud.post(test.api, payload)
      .then(r => opportunityId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${opportunityId}/notes`, notes))
      .then(r => cloud.delete(`${test.api}/${opportunityId}`));
  });
});
