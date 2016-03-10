'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'contacts', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let contactId;
  let noteId;
  it('should support CRUDS for contacts/notes', () =>{
    return cloud.post(test.api, payload)
    .then(r => contactId = r.body.id)
    .then(r => cloud.post(`${test.api}/${contactId}/notes`, note))
    .then(r => noteId = r.body.id)
    .then(r => cloud.get(`${test.api}/${contactId}/notes/${noteId}`))
    .then(r => cloud.patch(`${test.api}/${contactId}/notes/${noteId}`, {"description":"this is an updated note"}))
    .then(r => cloud.delete(`${test.api}/${contactId}/notes/${noteId}`))
    .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
