'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const tasks = require('./assets/tasks');
const cloud = require('core/cloud');

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  test.should.supportCruds();
  test.should.return404OnGet('0');
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
