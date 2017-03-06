'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const tools = require('core/tools');
const activityPayload = require('./assets/activities');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let contactId, noteId;
  it('should support CRUDS for contacts/notes', () => {
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.post(`${test.api}/${contactId}/notes`, note))
      .then(r => noteId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/notes/${noteId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}/notes/${noteId}`, { "description": tools.random() }))
      .then(r => cloud.delete(`${test.api}/${contactId}/notes/${noteId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  let activityId;
  it('should support CRUDS and pagination for contact/activities', () => {
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).post(`${test.api}/${contactId}/activities`, activityPayload))
      .then(r => activityId = r.body.id)
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).get(`${test.api}/${contactId}/activities/${activityId}`))
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).put(`${test.api}/${contactId}/activities/${activityId}`, { "description": tools.random() }))
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).delete(`${test.api}/${contactId}/activities/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
