'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/accounts');
const tools = require('core/tools');

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  let accountId, notesId;
  const updatePayload = {
    "content": "<h2>" + tools.randomStr() + "<h1>"
  };
  const notesPayload = {
    "content": "<h1> Helllo <h1>"
  };
  it('should support CRUDS for accounts/notes', () => {
    return cloud.post(`${test.api}`, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.get(`${test.api}/${accountId}/notes`))
      .then(r => cloud.post(`${test.api}/${accountId}/notes`, notesPayload))
      .then(r => notesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${accountId}/notes/${notesId}`))
      .then(r => cloud.put(`${test.api}/${accountId}/notes/${notesId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${accountId}/notes/${notesId}`))
      .then(r => cloud.delete(`${test.api}/${accountId}`));

  });
});
