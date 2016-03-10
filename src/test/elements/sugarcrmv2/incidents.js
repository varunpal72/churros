'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'incidents', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let incidentId;
  let noteId;
  it('should support CRUDS for incidents/notes', () =>{
    return cloud.post(test.api, payload)
    .then(r => incidentId = r.body.id)
    .then(r => cloud.post(`${test.api}/${incidentId}/notes`, note))
    .then(r => noteId = r.body.id)
    .then(r => cloud.get(`${test.api}/${incidentId}/notes/${noteId}`))
    .then(r => cloud.patch(`${test.api}/${incidentId}/notes/${noteId}`, {"description":"this is an updated note"}))
    .then(r => cloud.delete(`${test.api}/${incidentId}/notes/${noteId}`))
    .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
