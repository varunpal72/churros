'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const tools = require('core/tools');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const tasksUpdate = require('./assets/tasksUpdate');
const tasks = require('./assets/tasks');
const contact = () => ({
  FirstName: 'Conan',
  LastName: 'Barbarian',
  Email: tools.randomEmail()
});
suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
  it('should allow CRUDS for /hubs/crm/contacts', () => {
    let contactId, activityId, noteId, taskId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.get(test.api))
      .then(r => cloud.patch(`${test.api}/${contactId}`, payload))
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.post(`${test.api}/${contactId}/activities`, activities))
      .then(r => activityId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities/${activityId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}/activities/${activityId}`, activities))
      .then(r => cloud.delete(`${test.api}/${contactId}/activities/${activityId}`))
      .then(r => cloud.get(`${test.api}/${contactId}/notes`))
      .then(r => cloud.post(`${test.api}/${contactId}/notes`, notes))
      .then(r => noteId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${contactId}/notes/${noteId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}/notes/${noteId}`, notes))
      .then(r => cloud.delete(`${test.api}/${contactId}/notes/${noteId}`))
      .then(r => cloud.post(`${test.api}/${contactId}/tasks`, tasks))
      .then(r => taskId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${contactId}/tasks/${taskId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}/tasks/${taskId}`, tasksUpdate))
      .then(r => cloud.delete(`${test.api}/${contactId}/tasks/${taskId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it.skip('should allow CRUDS for /contacts/:id/attachments', () => {
    let contactId;
    let attachmentId;
    return cloud.post(test.api, contact())
      .then(r => contactId = r.body.id)
      .then(r => cloud.postFile(test.api + '/' + contactId + '/attachments', __dirname + '/assets/attach.txt'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + contactId + '/attachments/' + attachmentId))
      .then(r => cloud.get('/hubs/crm/attachments/' + attachmentId + '/data'))
      .then(r => cloud.patchFile('/hubs/crm/attachments/' + attachmentId, __dirname + '/assets/update.txt'))
      .then(r => cloud.delete('/hubs/crm/attachments/' + attachmentId))
      .then(r => cloud.delete(test.api + '/' + contactId));
  });

});