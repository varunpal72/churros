'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentPayload = require('./assets/incidents');

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  const build = (overrides) => Object.assign({}, incidentPayload, overrides);
  const payload = build({ title: tools.random(), description: tools.random() });
  it('should create a incident and then get all attachments and delete ata by attachment id', () => {
    let incidentId, attachmentId;
    let query = { fileName: "attach.txt" };
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.withOptions({ qs: query }).postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments`))
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/attachments/${attachmentId}`));
  });
});
