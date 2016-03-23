'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentsPayload = require('./assets/incidents');


suite.forElement('helpdesk', 'attachments', incidentsPayload, (test) => {
  let incidentId;
  let attachmentId;
  it('should create an incident and then an attachment for that id', () => {
    return cloud.post('/hubs/helpdesk/incidents',incidentsPayload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get('/hubs/helpdesk/incidents/' + incidentId))
      .then(r => cloud.get('/hubs/helpdesk/incidents/' + incidentId + '/attachments'))
      .then(r => cloud.postFile('/hubs/helpdesk/incidents/' + incidentId +'/attachments',  __dirname + '/assets/attach.txt'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get('/hubs/helpdesk/incidents/' + incidentId +'/attachments/' + attachmentId))
      .then(r => cloud.delete('/hubs/helpdesk/incidents/' + incidentId +'/attachments/' + attachmentId))
      .then(r => cloud.delete('/hubs/helpdesk/incidents/' + incidentId));
  });
  test.withApi('/hubs/helpdesk/incidents/4/attachments').should.supportPagination();
});
