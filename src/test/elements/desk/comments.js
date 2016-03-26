'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentsPayload = require('./assets/incidents');
const commentsPayload = require('./assets/comments');

const commentsUpdate = () => ({
  "body": "sent msg",
  "status": "sent"
});

suite.forElement('helpdesk', 'comments', commentsPayload, (test) => {
  let incidentId;
  let commentId;
  it('should create an incident and then comments for that id', () => {
    return cloud.post('/hubs/helpdesk/incidents', incidentsPayload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/incidents/${incidentId}`))
      .then(r => cloud.get(`/hubs/helpdesk/incidents/${incidentId}/comments`))
      .then(r => cloud.post(`/hubs/helpdesk/incidents/${incidentId}/comments`, commentsPayload))
      .then(r => commentId = r.body._embedded[0].comment_id)
      .then(r => cloud.get(`/hubs/helpdesk/incidents/${incidentId}/comments/${commentId}`))
      .then(r => cloud.patch(`/hubs/helpdesk/incidents/${incidentId}/comments/${commentId}`, commentsUpdate()))
      .then(r => cloud.delete(`/hubs/helpdesk/incidents/${incidentId}/comments/${commentId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/incidents/${incidentId}`));
  });
  test.withApi('/hubs/helpdesk/incidents/1/comments').should.supportPagination();
});
