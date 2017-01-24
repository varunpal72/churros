'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/opportunities');
const tools = require('core/tools');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  let opportunitiesId, activitiesId;
  const updatePayload = {
    "subject": tools.random()
  };
  const activitiesPayload = {
    "subject": tools.random(),
    "type": "call",
    "due_date": "2015-04-24",
    "due_time": "12:30"
  };
  it('should support CRUDS for opportunities/activities', () => {
    return cloud.post(test.api, payload)
      .then(r => opportunitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${opportunitiesId}/activities`))
      .then(r => cloud.post(`${test.api}/${opportunitiesId}/activities`, activitiesPayload))
      .then(r => activitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${opportunitiesId}/activities/${activitiesId}`))
      .then(r => cloud.put(`${test.api}/${opportunitiesId}/activities/${activitiesId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${opportunitiesId}/activities/${activitiesId}`));
  });

  it('should GET /accounts emails and mails', () => {
    return cloud.get(`${test.api}/${opportunitiesId}/emails`)
      .then(r => cloud.get(`${test.api}/${opportunitiesId}/mails`))
      .then(r => cloud.delete(`${test.api}/${opportunitiesId}`));

  });
});
