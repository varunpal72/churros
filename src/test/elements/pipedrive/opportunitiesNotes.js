'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/opportunities');
const tools = require('core/tools');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  let opportunitiesId, notesId;
  const updatePayload = {
    "content": "<h2>" + tools.randomStr() + "<h1>"
  };
  const notesPayload = {
    "content": "<h1> Helllo <h1>"
  };
  it('should support CRUDS for opportunities/notes', () => {
    return cloud.post(`${test.api}`, payload)
      .then(r => opportunitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${opportunitiesId}/notes`))
      .then(r => cloud.post(`${test.api}/${opportunitiesId}/notes`, notesPayload))
      .then(r => notesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${opportunitiesId}/notes/${notesId}`))
      .then(r => cloud.put(`${test.api}/${opportunitiesId}/notes/${notesId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${opportunitiesId}/notes/${notesId}`))
      .then(r => cloud.delete(`${test.api}/${opportunitiesId}`));


  });
});
