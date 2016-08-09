'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const account = require('./assets/account');
const notePost = require('./assets/notePost');
const notePatch = require('./assets/notePatch');

suite.forElement('crm', 'notes', (test) => {
  it(`should allow CUDS for /hubs/crm/accounts/{id}/notes`, () => {
    let accountId, noteId;
    return cloud.post(`/hubs/crm/accounts`, account)
      .then(r => accountId = r.body.id)
      .then(r => cloud.post(`/hubs/crm/accounts/${accountId}/notes`, notePost))
      .then(r => noteId = r.body.id)
      .then(r => cloud.patch(`/hubs/crm/accounts/${accountId}/notes/${noteId}`, notePatch))
      .then(r => cloud.get(`/hubs/crm/accounts/${accountId}/notes`))
      .then(r => cloud.delete(`/hubs/crm/accounts/${accountId}/notes/${noteId}`))
      .then(r => cloud.delete(`/hubs/crm/accounts/${accountId}`));
  });
});
