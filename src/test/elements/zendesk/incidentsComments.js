'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentsPayload = require('./assets/incidents');
const commentsPayload = require('./assets/comments');

suite.forElement('helpdesk', 'incidents', { payload: incidentsPayload }, (test) => {
  const build = (overrides) => Object.assign({}, incidentsPayload, overrides);
  const payload = build({ body: tools.random() });
  it('should support CRDS for /hubs/helpdesk/incidents/:id/comments, pagination and CEQL search', () => {
    let incidentId, commentId;
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/comments`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.withOptions({ qs: { where: `priority= 'high'` } }).get(`${test.api}/${incidentId}/comments`))
      .then(r => cloud.post(`${test.api}/${incidentId}/comments`, commentsPayload))
      .then(r => commentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/comments/${commentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/comments/${commentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
