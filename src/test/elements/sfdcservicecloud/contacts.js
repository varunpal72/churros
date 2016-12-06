'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const activityPayload = require('./assets/activities');
const taskPayload = require('./assets/tasks');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ lastName: tools.random(), firstName: tools.random(), email: tools.randomEmail() });

suite.forElement('helpdesk', 'contacts', { payload: contactsPayload }, (test) => {
  it('should allow ping for sfdcservicecloud', () => {
    return cloud.get(`/hubs/helpdesk/ping`);
  });

  it('should allow CRUDS /hubs/helpdesk/contacts ', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `id='${contactId}'` } }).get(test.api))
      .then(r => cloud.patch(`${test.api}/${contactId}`, contactsPayload))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should allow CRUDS /hubs/helpdesk/contacts/:id/activites ', () => {
    let contactId, activityId;
    const activityUpdatePayload = {
      "Location": tools.random()
    };
    return cloud.post(test.api, contactsPayload)
      .then(r => contactId = r.body.Id)
      .then(r => cloud.post(`${test.api}/${contactId}/activities`, activityPayload))
      .then(r => activityId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities/${activityId}`))
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions({ qs: { where: `id='${activityId}'` } }).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.patch(`${test.api}/${contactId}/activities/${activityId}`, activityUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}/activities/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should allow CRUDS /hubs/helpdesk/contacts/:id/tasks ', () => {
    let contactId, taskId;
    const taskUpdatePayload = {
      "Status": tools.random()
    };
    return cloud.post(test.api, contactsPayload)
      .then(r => contactId = r.body.Id)
      .then(r => cloud.post(`${test.api}/${contactId}/tasks`, taskPayload))
      .then(r => taskId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${contactId}/tasks/${taskId}`))
      .then(r => cloud.get(`${test.api}/${contactId}/tasks`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/tasks`))
      .then(r => cloud.withOptions({ qs: { where: `id='${taskId}'` } }).get(`${test.api}/${contactId}/tasks`))
      .then(r => cloud.patch(`${test.api}/${contactId}/tasks/${taskId}`, taskUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}/tasks/${taskId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
