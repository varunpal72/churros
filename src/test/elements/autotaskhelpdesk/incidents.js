'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const fs = require('fs');
const payload = require('./assets/incidents');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const incidentPayload = build({ title: tools.random(), description: tools.random() });
const comment = require('./assets/comments');
const updatedComment = require('./assets/updatedComments');

const updatePayload = {
  "title": tools.random(),
  "priority": "1",
  "description": "This has been changed"
};

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  const build = (overrides) => Object.assign({}, incidentPayload, overrides);
  const payload = build({ title: tools.random(), description: tools.random() });
  it(`should support paging, Ceql search and Crus for ${test.api}, comments and attachments`, () => {
    let incidentId, attachmentId, commentId;
    let query = { fileName: "attach.txt" };
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: 'priority = 1' } }).get(test.api))
      .then(r => cloud.patch(`${test.api}/${incidentId}`, updatePayload))
      .then(r => cloud.put(`${test.api}/${incidentId}/comments`, comment))
      .then(r => cloud.get(`${test.api}/${incidentId}/comments`))
      .then(r => commentId = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${incidentId}/comments/${commentId}`, updatedComment))
      .then(r => cloud.get(`${test.api}/${incidentId}/comments/${commentId}`))
      .then(r => cloud.withOptions({ qs: query }).postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments`))
      .then(r => cloud.withOptions({
        qs: { fileName: "Test.pdf" },
        formData: { file: fs.createReadStream(__dirname + '/assets/Test.pdf') }
      }).put(`${test.api}/${incidentId}/attachments`, undefined))
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments`))
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/attachments/${attachmentId}`));
  });
});
