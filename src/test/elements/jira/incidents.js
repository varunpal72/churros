'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/incidents');
const commentPayload = require('./assets/incidentComments')

suite.forElement('helpdesk', 'incidents', payload, (test) => {

  it('should allow CRUDS for /incidents/:id/comments', () => {
    let incidentId;
    let commentId;
    return cloud.post('/hubs/helpdesk/incidents', payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.cruds('/hubs/helpdesk/incidents/' + incidentId + '/comments', commentPayload))
      .then(r => cloud.delete('/hubs/helpdesk/incidents/' + incidentId));
  });
  it('should allow CRUDS for /incidents/:id/attachments', () => {
    let incidentId;
    let attachmentId;
    let query = {fileName : "testfile.txt"}
    return cloud.post('/hubs/helpdesk/incidents', payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.postFile('hubs/helpdesk/incidents/' + incidentId + '/attachments', __dirname + '/assets/attach.txt', { qs: query }))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get('/hubs/helpdesk/attachments/' + attachmentId))
      .then(r => cloud.get('/hubs/helpdesk/incidents/' + incidentId + '/attachments'))
      .then(r => cloud.delete('/hubs/crm/attachments/' + attachmentId))
      .then(r => cloud.delete(test.api + '/' + contactId));
  });
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
});
