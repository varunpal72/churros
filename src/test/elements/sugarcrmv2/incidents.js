'use strict';

const suite = require('core/suite');
const fs = require('fs');
const payload = require('./assets/incidents');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'incidents', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let incidentId, noteId;
  it('should support CRUDS for incidents/notes', () => {
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.post(`${test.api}/${incidentId}/notes`, note))
      .then(r => noteId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/notes/${noteId}`))
      .then(r => cloud.patch(`${test.api}/${incidentId}/notes/${noteId}`, { "description": "this is an updated note" }))
      .then(r => cloud.delete(`${test.api}/${incidentId}/notes/${noteId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });

  it('should support GET and pagination for /hubs/crm/incindents/:incidentIdId/history', () => {
    return cloud.get(test.api)
      .then(r => incidentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}/history`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${incidentId}/history`));
  });

  let path = __dirname + '/assets/temp.jpg';
  const attachments = { formData: { file: fs.createReadStream(path) } };
  it('should support RUD for incidents/notes/attachments', () => {
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.post(`${test.api}/${incidentId}/notes`, note))
      .then(r => noteId = r.body.id)
      .then(r => cloud.withOptions(attachments).put(`${test.api}/${incidentId}/notes/${noteId}/attachments`, undefined))
   // .then(r => cloud.get(`${test.api}/${incidentId}/notes/${noteId}/attachments`)) ...currently this Api is not working from CE side.
      .then(r => cloud.delete(`${test.api}/${incidentId}/notes/${noteId}/attachments`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/notes/${noteId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
