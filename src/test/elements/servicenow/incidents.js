'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const cloud = require('core/cloud');

const options = {
  churros: {
    updatePayload: {
      "description": "I am an updated incident"
    }
  }
};

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  test.withName('should allow >= Ceql search').withOptions({ qs: { where: 'sys_created_on>=\'2016-02-06T16:35:36\'' } }).should.return200OnGet();

  it('should allow CRDS for /hubs/helpdesk/incidents/{id}/attachments', () => {
    let incidentId = -1;
    let attachmentId = -1;
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => attachmentId = r.body.sys_id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${incidentId}/attachments`))
      .then(r => cloud.withOptions({ qs: { where: 'sys_created_on>=\'2016-02-06T16:35:36\'' } }).get(`${test.api}/${incidentId}/attachments`))
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });

  it('should allow CS for /hubs/helpdesk/incidents/{id}/comments', () => {
    let commentsPayload = () => ({
      "comments": "I am a churro"
    });
    let incidentId = -1;
    return cloud.get(test.api)
      .then(r => incidentId = r.body[0].id)
      .then(r => cloud.post(`${test.api}/${incidentId}/comments`, commentsPayload()))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${incidentId}/comments`));
  });
  it('should allow CS for /hubs/helpdesk/incidents/{id}/work-notes', () => {
    let notesPayload = () => ({
      "work_notes": "I am the churro"
    });
    let incidentId = -1;
    return cloud.get(test.api)
      .then(r => incidentId = r.body[0].id)
      .then(r => cloud.post(`${test.api}/${incidentId}/work-notes`, notesPayload()))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${incidentId}/work-notes`));
  });
});
