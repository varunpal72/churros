'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const tools = require('core/tools');

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  let contactId, activitiesId;
  const updatePayload = {
    "subject": tools.random()
  };
  const activitiesPayload = {
    "subject": tools.random(),
    "type": "call",
    "due_date": "2015-04-24",
    "due_time": "12:30"
  };
  it('should support CRUDS for contacts/activities', () => {
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.post(`${test.api}/${contactId}/activities`, activitiesPayload))
      .then(r => activitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities/${activitiesId}`))
      .then(r => cloud.put(`${test.api}/${contactId}/activities/${activitiesId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}/activities/${activitiesId}`));
  });

  it('should GET /contacts emails and mails', () => {
    return cloud.get(`${test.api}/${contactId}/emails`)
      .then(r => cloud.get(`${test.api}/${contactId}/mails`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));

  });
});
