'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/incidents');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const incidentPayload = build({ title: tools.random(), description: tools.random() });

const updatePayload = {
  "title": tools.random(),
  "priority": "1",
  "description": "This has been changed"
};

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  const build = (overrides) => Object.assign({}, incidentPayload, overrides);
  const payload = build({ title: tools.random(), description: tools.random() });
  it(`should support paging, Ceql search and Crus for ${test.api}`, () => {
    let incidentId, attachmentId;
    let query = { fileName: "attach.txt" };
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { where: 'priority = 1' } }).get(`${test.api}`))
      .then(r => cloud.patch(`${test.api}/${incidentId}`, updatePayload))
      .then(r => cloud.withOptions({ qs: query }).postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments`))
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/attachments/${attachmentId}`));
  });
});
