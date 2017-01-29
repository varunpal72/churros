'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const tasks = require('./assets/tasks');
const cloud = require('core/cloud');
const tasksUpdate = require('./assets/tasksUpdate');
suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  it('should allow CRUDS for /hubs/crm/leads', () => {
    let leadId, activityId, noteId, taskId;
    return cloud.post(test.api, payload)
      .then(r => leadId = r.body.id)
      .then(r => cloud.get(`${test.api}/${leadId}`))
      .then(r => cloud.get(test.api))
      .then(r => cloud.patch(`${test.api}/${leadId}`, payload))
      .then(r => cloud.get(`${test.api}/${leadId}/activities`))
      .then(r => cloud.post(`${test.api}/${leadId}/activities`, activities))
      .then(r => activityId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${leadId}/activities/${activityId}`))
      .then(r => cloud.patch(`${test.api}/${leadId}/activities/${activityId}`, activities))
      .then(r => cloud.delete(`${test.api}/${leadId}/activities/${activityId}`))
      .then(r => cloud.get(`${test.api}/${leadId}/notes`))
      .then(r => cloud.post(`${test.api}/${leadId}/notes`, notes))
      .then(r => noteId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${leadId}/notes/${noteId}`))
      .then(r => cloud.patch(`${test.api}/${leadId}/notes/${noteId}`, notes))
      .then(r => cloud.delete(`${test.api}/${leadId}/notes/${noteId}`))
      .then(r => cloud.post(`${test.api}/${leadId}/tasks`, tasks))
      .then(r => taskId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${leadId}/tasks/${taskId}`))
      .then(r => cloud.patch(`${test.api}/${leadId}/tasks/${taskId}`, tasksUpdate))
      .then(r => cloud.delete(`${test.api}/${leadId}/tasks/${taskId}`))
      .then(r => cloud.delete(`${test.api}/${leadId}`));
  });

});