'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'leads', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let leadId;
  let noteId;
  it('should support CRUDS for leads/notes', () =>{
    return cloud.post(test.api, payload)
    .then(r => leadId = r.body.id)
    .then(r => cloud.post(`${test.api}/${leadId}/notes`, note))
    .then(r => noteId = r.body.id)
    .then(r => cloud.get(`${test.api}/${leadId}/notes/${noteId}`))
    .then(r => cloud.patch(`${test.api}/${leadId}/notes/${noteId}`, {"description":"this is an updated note"}))
    .then(r => cloud.delete(`${test.api}/${leadId}/notes/${noteId}`))
    .then(r => cloud.delete(`${test.api}/${leadId}`));
  });
});
