'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentPayload = require('./assets/incidents');

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  const build = (overrides) => Object.assign({}, incidentPayload, overrides);
  const payload = build({ title: tools.random(), description: tools.random() });
  it('should create an incident and then get history', () => {
    let incidentId, historyId;
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/history`))
      .then(r => historyId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}/history/${historyId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/history/${historyId}`));
  });
});
