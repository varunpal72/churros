'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/incidents');
const commentPayload = require('./assets/incidentComments');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {

  it('should allow CRUDS for /incidents/:id/comments', () => {
    let incidentId;
    return cloud.post('/hubs/helpdesk/incidents', payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.cruds('/hubs/helpdesk/incidents/' + incidentId + '/comments', commentPayload))
      .then(r => cloud.delete('/hubs/helpdesk/incidents/' + incidentId));
  });

  it('should allow CRUDS for /incidents/:id/attachments', () => {
    let query = { fileName: "testfile.txt" };
    let incidentId, attachmentId;
    return cloud.post('/hubs/helpdesk/incidents', payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.withOptions({ qs: query }).postFile('hubs/helpdesk/incidents/' + incidentId + '/attachments', __dirname + '/assets/attach.txt'))
      .then(r => cloud.get('/hubs/helpdesk/incidents/' + incidentId + '/attachments'))
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.get('/hubs/helpdesk/attachments/' + attachmentId))
      .then(r => cloud.delete('/hubs/helpdesk/attachments/' + attachmentId))
      .then(r => cloud.delete(test.api + '/' + incidentId));
  });
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
});
