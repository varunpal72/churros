'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'accounts', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let accountId;
  let noteId;
  it('should support CRUDS for accounts/notes', () =>{
    return cloud.post(test.api, payload)
    .then(r => accountId = r.body.id)
    .then(r => cloud.post(`${test.api}/${accountId}/notes`, note))
    .then(r => noteId = r.body.id)
    .then(r => cloud.get(`${test.api}/${accountId}/notes/${noteId}`))
    .then(r => cloud.patch(`${test.api}/${accountId}/notes/${noteId}`, {"description":"this is an updated note"}))
    .then(r => cloud.delete(`${test.api}/${accountId}/notes/${noteId}`))
    .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});