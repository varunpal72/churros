'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/accounts');
const tools = require('core/tools');

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  let accountId, activitiesId;
  const updatePayload = {
    "subject": tools.random()
  };
  const activitiesPayload = {
    "subject": tools.random(),
    "type": "call",
    "due_date": "2015-04-24",
    "due_time": "12:30"
  };
  it('should support CRUDS for accounts/activities', () => {
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.get(`${test.api}/${accountId}/activities`))
      .then(r => cloud.post(`${test.api}/${accountId}/activities`, activitiesPayload))
      .then(r => activitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${accountId}/activities/${activitiesId}`))
      .then(r => cloud.put(`${test.api}/${accountId}/activities/${activitiesId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${accountId}/activities/${activitiesId}`));
  });

  it('should GET /accounts emails and mails', () => {
    return cloud.get(`${test.api}/${accountId}/emails`)
      .then(r => cloud.get(`${test.api}/${accountId}/mails`))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});
