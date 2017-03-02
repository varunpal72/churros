'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const taskPayload = require('./assets/task');
const cloud = require('core/cloud');
const commentPayload = require('./assets/comments');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.should.return200OnGet();

  it('it should support POST', () => {
    return cloud.post('/hubs/helpdesk/incidents', payload);
  });

  it('it should support GET by id', () => {
    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(filteredIncidents => cloud.get(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}`));
  });

  it.skip('it should support PATCH', () => {
    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(filteredIncidents => cloud.patch(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}`, payload));
  });

  it('it should support DELETE', () => {
    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(filteredIncidents => cloud.delete(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}`, payload));
  });

  it('it should support POST a comment inside an incident', () => {
    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(filteredIncidents => cloud.post(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/comments`, commentPayload));
  });

  it('it should support GET all tasks inside an incident', () => {
    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(filteredIncidents => cloud.get(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks`));
  });

  it('it should support POST a task inside an incident', () => {
    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(filteredIncidents => cloud.post(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks`, taskPayload));
  });

  it('it should support GET a task inside an incident', () => {
    let filteredIncidents;

    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(fi => filteredIncidents = fi)
      .then(() => cloud.post(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks`, taskPayload))
      .then(tasks => cloud.get(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks/${tasks.body.id}`));
  });

  it('it should support PATCH a task inside an incident', () => {
    let filteredIncidents;

    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(fi => filteredIncidents = fi)
      .then(() => cloud.post(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks`, taskPayload))
      .then(tasks => cloud.patch(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks/${tasks.body.id}`, taskPayload));
  });

  it('it should support DELETE a task inside an incident', () => {
    let filteredIncidents;

    return cloud.get('/hubs/helpdesk/incidents')
      .then(r => r.body.filter(r => r.display_id))
      .then(fi => filteredIncidents = fi)
      .then(() => cloud.post(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks`, taskPayload))
      .then(tasks => cloud.delete(`/hubs/helpdesk/incidents/${filteredIncidents[0].display_id}/tasks/${tasks.body.id}`));
  });

});
