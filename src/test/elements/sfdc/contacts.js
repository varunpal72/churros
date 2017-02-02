'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const tools = require('core/tools');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const tasks = require('./assets/tasks');
const contact = () => ({
  FirstName: 'Conan',
  LastName: 'Barbarian',
  Email: tools.randomEmail()
});
suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  it('should allow CRUDS for /hubs/crm/contacts/:id/activites', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/activities`, activities))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
  it('should allow CRUDS for /hubs/crm/contacts/:id/notes', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/notes`, notes))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
  it('should allow CRUDS for /hubs/crm/contacts/:id/tasks', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/tasks`, tasks))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it.skip('should allow CRUDS for /contacts/:id/attachments', () => {
    let contactId, attachmentId;
    return cloud.post(test.api, contact())
      .then(r => contactId = r.body.id)
      .then(r => cloud.postFile(`/hubs/crm/Contact/${contactId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`/hubs/crm/Contact/${contactId}/attachments`))
      .then(r => cloud.get(`/hubs/crm/attachments/${attachmentId}`))
      .then(r => cloud.get(`/hubs/crm/attachments/${attachmentId}/data`))
      .then(r => cloud.patchFile(`/hubs/crm/attachments/${attachmentId}`, __dirname + '/assets/update.txt'))
      .then(r => cloud.delete(`/hubs/crm/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});