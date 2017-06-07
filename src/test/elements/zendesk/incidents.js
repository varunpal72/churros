'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentPayload = tools.requirePayload(`${__dirname}/assets/incidents.json`);
const commentsPayload = require('./assets/comments');

const options = {
  churros: {
    updatePayload: {
      "status": "closed",
      "summary": "Updated Summary"
    }
  }
};

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  it('should support creating an attachment for an incident', () => {
    let incidentId;
    let query = { fileName: "attach.txt", description: "desc" };
    return cloud.post(test.api, incidentPayload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.withOptions({ qs: query }).postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
  it('should support CRDS for /hubs/helpdesk/incidents/:id/comments, pagination and CEQL search', () => {
    let incidentId, commentId;
    return cloud.post(test.api, incidentPayload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/comments`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.withOptions({ qs: { where: `priority= 'high'` } }).get(`${test.api}/${incidentId}/comments`))
      .then(r => cloud.post(`${test.api}/${incidentId}/comments`, commentsPayload))
      .then(r => commentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/comments/${commentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/comments/${commentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
  it('should support SRD for /hubs/helpdesk/incidents/:id/history', () => {
    let incidentId, historyId;
    return cloud.post(test.api, incidentPayload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/history`))
      .then(r => historyId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}/history/${historyId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/history/${historyId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
