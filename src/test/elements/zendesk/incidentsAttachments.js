'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentPayload = require('./assets/incidents');

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  const build = (overrides) => Object.assign({}, incidentPayload, overrides);
  const payload = build({ title: tools.random(), description: tools.random() });
  it('should create an incident attachment', () => {
    let incidentId, attachmentId;
    let query = { fileName: "attach.txt", description: "desc" };
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.withOptions({ qs: query }).postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/attach.txt'))
  });
});
