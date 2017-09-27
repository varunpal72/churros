'use strict';

//dependencies at the top
const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
//how to import payloads
const payload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const activities = tools.requirePayload(`${__dirname}/assets/activities.json`);
const notes = tools.requirePayload(`${__dirname}/assets/notes.json`);
const tasks = tools.requirePayload(`${__dirname}/assets/tasks.json`);


suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');//search leads by id
  test.should.supportCruds();
  test.should.return404OnGet('0');//should not find lead with id of '0'
  test
  .withOptions({ qs: { where: "email=''" } })//serching leads by email
  .withValidation(r => r.body.forEach(t => expect(t.email).to.be.empty))//validating the search results match the search
  .should.return200OnGet();

  //'it' statements to test sfdc specific issues
  it('should allow CRUDS for /hubs/crm/leads/:id/activites', () => {
    let leadId;
    return cloud.post(test.api, payload)
      .then(r => leadId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${leadId}/activities`, activities))
      .then(r => cloud.delete(`${test.api}/${leadId}`));
  });
  it('should allow CRUDS for /hubs/crm/leads/:id/notes', () => {
    let leadId;
    return cloud.post(test.api, payload)
      .then(r => leadId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${leadId}/notes`, notes))
      .then(r => cloud.delete(`${test.api}/${leadId}`));
  });
  it('should allow CRUDS for /hubs/crm/leads/:id/tasks', () => {
    let leadId;
    return cloud.post(test.api, payload)
      .then(r => leadId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${leadId}/tasks`, tasks))
      .then(r => cloud.delete(`${test.api}/${leadId}`));
  });
});
