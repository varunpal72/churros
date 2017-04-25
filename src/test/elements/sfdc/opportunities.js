'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const cloud = require('core/cloud');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  test.should.supportCruds();
  test.should.return404OnGet('0');
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
