'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const tools = require('core/tools');

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  let contactId, notesId;
  const updatePayload = {
    "content": "<h2>" + tools.randomStr() + "<h1>"
  };
  const notesPayload = {
    "content": "<h1> Helllo <h1>"
  };

  it('should support CRUDS for contacts/notes', () => {
    return cloud.post(`${test.api}`, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/notes`))
      .then(r => cloud.post(`${test.api}/${contactId}/notes`, notesPayload))
      .then(r => notesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/notes/${notesId}`))
      .then(r => cloud.put(`${test.api}/${contactId}/notes/${notesId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}/notes/${notesId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
