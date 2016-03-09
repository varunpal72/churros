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
  it('Should support CRUDS for accounts/notes', () =>{
    return cloud.post(test.api, { name: 'churros tmp account' })
    .then(r => accountId = r.body.id)
    .then(console.log(r))
    .then(r => cloud.delete(test.api + '/' + accountId));
    // .then(r => cloud.cruds(test.api + '/notes', note))
  });
});


//  /accounts/{accountId}/notes Search for notes for an account
// POST /accounts/{accountId}/notes Create a new note for an account
// DELETE /accounts/{accountId}/notes/{noteId} Delete a note for an account
// GET /accounts/{accountId}/notes/{noteId} Retrieve a note for an account
// PATCH /accounts/{accountId}/notes/{noteId} Update a note for an account
