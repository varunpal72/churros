'use strict';
const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/accounts');
const activityPayload = require('./assets/activities');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let accountId;
  let noteId;
  it('should support CRUDS for accounts/notes', () => {
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.post(`${test.api}/${accountId}/notes`, note))
      .then(r => noteId = r.body.id)
      .then(r => cloud.get(`${test.api}/${accountId}/notes/${noteId}`))
      .then(r => cloud.patch(`${test.api}/${accountId}/notes/${noteId}`, { "description": tools.random() }))
      .then(r => cloud.delete(`${test.api}/${accountId}/notes/${noteId}`))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });

  let activityId;
  it('should support CRUDS and pagination for accounts/activities', () => {
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${accountId}/activities`))
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).post(`${test.api}/${accountId}/activities`, activityPayload))
      .then(r => activityId = r.body.id)
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).get(`${test.api}/${accountId}/activities/${activityId}`))
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).put(`${test.api}/${accountId}/activities/${activityId}`, { "description": tools.random() }))
      .then(r => cloud.withOptions({ qs: { type: 'Call' } }).delete(`${test.api}/${accountId}/activities/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});
