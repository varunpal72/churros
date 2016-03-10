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
  it('Should support CRUDS for accounts/notes', () =>{
    return cloud.post(test.api, payload)
    .then(r => {accountId = r.body.id;})
    .then(() => cloud.post(`${test.api}/${accountId}/notes`, note))
    .then(r => {noteId = r.body.id;})
    .then(r => cloud.get(`${test.api}/${accountId}/notes/${noteId}`))
    .then(r => cloud.patch(`${test.api}/${accountId}/notes/${noteId}`, {"description":"this is an updated note"}))
    .then(r => cloud.delete(`${test.api}/${accountId}/notes/${noteId}`))
    .then(r => cloud.delete(test.api + '/' + accountId));
  });
});


//  /accounts/{accountId}/notes Search for notes for an account
// POST /accounts/{accountId}/notes Create a new note for an account
// DELETE /accounts/{accountId}/notes/{noteId} Delete a note for an account
// GET /accounts/{accountId}/notes/{noteId} Retrieve a note for an account
// PATCH /accounts/{accountId}/notes/{noteId} Update a note for an account
