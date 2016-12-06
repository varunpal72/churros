'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const cloud = require('core/cloud');
suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  it('should allow CRUDS for /hubs/crm/opportunities', () => {
    let opportunityId, activityId, noteId;
    return cloud.post(test.api, payload)
        .then(r => opportunityId = r.body.id)
        .then(r => cloud.get(`${test.api}/${opportunityId}`))
        .then(r => cloud.get(test.api))
        .then(r => cloud.patch(`${test.api}/${opportunityId}`, payload))
        .then(r => cloud.get(`${test.api}/${opportunityId}/activities`))
        .then(r => cloud.post(`${test.api}/${opportunityId}/activities`,activities))
        .then(r => activityId = r.body.Id)
        .then(r => cloud.get(`${test.api}/${opportunityId}/activities/${activityId}`))
        .then(r => cloud.patch(`${test.api}/${opportunityId}/activities/${activityId}`,activities))
        .then(r => cloud.delete(`${test.api}/${opportunityId}/activities/${activityId}`))
        .then(r => cloud.get(`${test.api}/${opportunityId}/notes`))
        .then(r => cloud.post(`${test.api}/${opportunityId}/notes`,notes))
        .then(r => noteId = r.body.Id)
        .then(r => cloud.get(`${test.api}/${opportunityId}/notes/${noteId}`))
        .then(r => cloud.delete(`${test.api}/${opportunityId}/notes/${noteId}`))
        .then(r => cloud.delete(`${test.api}/${opportunityId}`));
  });
});
