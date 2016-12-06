'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const tasks = require('./assets/tasks');
const tasksUpdate = require('./assets/tasksUpdate');
const cloud = require('core/cloud');

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
    it('should allow CRUDS for /hubs/crm/accounts', () => {
      let accountId, activityId, noteId, taskId;
      return cloud.post(test.api, payload)
          .then(r => accountId = r.body.id)
          .then(r => cloud.get(`${test.api}/${accountId}`))
          .then(r => cloud.get(test.api))
          .then(r => cloud.patch(`${test.api}/${accountId}`, payload))
          .then(r => cloud.get(`${test.api}/${accountId}/activities`))
          .then(r => cloud.post(`${test.api}/${accountId}/activities`,activities))
          .then(r => activityId = r.body.Id)
          .then(r => cloud.get(`${test.api}/${accountId}/activities/${activityId}`))
          .then(r => cloud.patch(`${test.api}/${accountId}/activities/${activityId}`,activities))
          .then(r => cloud.delete(`${test.api}/${accountId}/activities/${activityId}`))
          .then(r => cloud.get(`${test.api}/${accountId}/notes`))
          .then(r => cloud.post(`${test.api}/${accountId}/notes`,notes))
          .then(r => noteId = r.body.Id)
          .then(r => cloud.get(`${test.api}/${accountId}/notes/${noteId}`))
          .then(r => cloud.delete(`${test.api}/${accountId}/notes/${noteId}`))
          .then(r => cloud.post(`${test.api}/${accountId}/tasks`,tasks))
          .then(r => taskId = r.body.Id)
          .then(r => cloud.get(`${test.api}/${accountId}/tasks/${taskId}`))
          .then(r => cloud.patch(`${test.api}/${accountId}/tasks/${taskId}`,tasksUpdate))
          .then(r => cloud.delete(`${test.api}/${accountId}/tasks/${taskId}`))
          .then(r => cloud.delete(`${test.api}/${accountId}`));
    });
});
