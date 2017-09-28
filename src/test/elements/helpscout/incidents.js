'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
// const payload = require('./assets/payload');
const payload = require('./assets/incident');
const updatePayload = require('./assets/updatedIncident');
const thread = require('./assets/thread');
const attachmentsApi = '/hubs/helpdesk/attachments';
const email = tools.randomEmail();

suite.forElement('helpdesk', 'incidents', null, (test) => {

  it(`should allow allow C for ${attachmentsApi}`, () => {
    return cloud.postFile(attachmentsApi, __dirname + "/assets/attachment.txt")
      .then(r => payload.threads[0].attachments[0].hash = r.body.hash);
  });

  payload.customer.email = email;
  payload.threads[0].createdBy.email = email;

  it(`should allow allow CRUDS for ${test.api}, R for ${test.api}/{id}/comments and RD for ${attachmentsApi}`, () => {
    let incidentId, incidentBody;
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${incidentId}`))
      .then(r => incidentBody = r.body)
      .then(r => cloud.get(`${attachmentsApi}/${incidentBody.threads[0].attachments[0].id}`))
      .then(r => cloud.delete(`${attachmentsApi}/${incidentBody.threads[0].attachments[0].id}`))
      .then(r => cloud.patch(`${test.api}/${incidentId}`, updatePayload))
      .then(r => cloud.get(`${test.api}/${incidentId}`))
      .then(r => cloud.put(`${test.api}/${incidentId}/comments/${incidentBody.threads[0].id}`, thread))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });

  it(`should allow paginating with page ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 1 } }).get(test.api);
  });

  it(`should support searching ${test.api} by modifiedSince`, () => {
    return cloud.withOptions({ qs: { where: `modifiedSince='2016-09-30T17:21:00Z'` } }).get(test.api);
  });

  it(`should allow paginating with page and searching ${test.api} by modifiedSince`, () => {
    return cloud.withOptions({ qs: { page: 1, where: `modifiedSince='2016-09-30T17:21:00Z'` } }).get(test.api);
  });
});
