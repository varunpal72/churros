'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const activityPayload = require('./assets/activities');
const taskPayload = require('./assets/tasks');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const incidentsPayload = build({ description: tools.random() });

suite.forElement('helpdesk', 'incidents', { payload: incidentsPayload }, (test) => {
  it('should allow CRUDS /hubs/helpdesk/incidents/:id/activites ', () => {
    let incidentId,activityId;
    const activityUpdatePayload =  {
        "Location": tools.random()
    };
    return cloud.post(test.api, incidentsPayload)
      .then(r => incidentId = r.body.Id)
      .then(r => cloud.post(`${test.api}/${incidentId}/activities`, activityPayload))
      .then(r => activityId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${incidentId}/activities/${activityId}`))
      .then(r => cloud.get(`${test.api}/${incidentId}/activities`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${incidentId}/activities`))
      .then(r => cloud.withOptions({ qs: { where: `id='${activityId}'` } }).get(`${test.api}/${incidentId}/activities`))
      .then(r => cloud.patch(`${test.api}/${incidentId}/activities/${activityId}`, activityUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${incidentId}/activities/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });

  it('should allow CRUDS /hubs/helpdesk/incidents/:id/tasks ', () => {
    let incidentId,taskId;
    const taskUpdatePayload =  {
        "Status": tools.random()
    };
    return cloud.post(test.api, incidentsPayload)
      .then(r => incidentId = r.body.Id)
      .then(r => cloud.post(`${test.api}/${incidentId}/tasks`, taskPayload))
      .then(r => taskId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${incidentId}/tasks/${taskId}`))
      .then(r => cloud.get(`${test.api}/${incidentId}/tasks`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${incidentId}/tasks`))
      .then(r => cloud.withOptions({ qs: { where: `id='${taskId}'` } }).get(`${test.api}/${incidentId}/tasks`))
      .then(r => cloud.patch(`${test.api}/${incidentId}/tasks/${taskId}`, taskUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${incidentId}/tasks/${taskId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
