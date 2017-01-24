'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
// const payload = require('./assets/payload');
const payload = require('./assets/incident');
const updatePayload = require('./assets/updatedIncident');
const thread = require('./assets/thread');
const attachmentsApi = '/hub/helpdesk/attachments';
const email = tools.randomEmail();

suite.forElement('helpdesk', 'incidents', null, (test) => {
  /*
  let attachmentHash;
  it(`should allow allow C for ${attachmentsApi}`, () => {
    return cloud.postFile(attachmentsApi, __dirname + "/assets/attachment.txt")
      .then(r => attachmentHash = r.body.hash);
  });

  payload.threads[0].attachments[0].hash = attachmentHash;
  */
  payload.customer.email = email;
  payload.threads[0].createdBy.email = email;

  it(`should allow allow CRUDS for ${test.api}, R for ${test.api}/{id}/comments and RD for ${attachmentsApi}`, () => {
    let incidentId;
    let threadId;
    // let attachmentId;
    return cloud.post(test.api, payload)
      .then(r => cloud.get(test.api))
      .then(r => incidentId = r.body.filter(function(incident) {
        return incident.customer ? incident.customer.email ? incident.customer.email === email : false : false;
      })[0].id)
      .then(r => cloud.get(`${test.api}/${incidentId}`))
      .then(r => threadId = r.body.threads.filter(function(thread) {
        return thread.body ? thread.body === payload.threads[0].body : false;
      })[0].id)
      /*
      .then(r => attachmentId = r.body.threads[0].attachments[0].id)
      .then(r => cloud.get(`${attachmentsApi}/${attachmentId}`))
      .then(r => cloud.delete(`${attachmentsApi}/${attachmentId}`))
      */
      .then(r => cloud.patch(`${test.api}/${incidentId}`, updatePayload))
      .then(r => cloud.get(`${test.api}/${incidentId}`))
      .then(r => cloud.put(`${test.api}/${incidentId}/comments/${threadId}`, thread))
      .then(r => cloud.get(`${test.api}/${incidentId}`));
  });

  it(`should allow paginating with page ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 1 } }).get(test.api);
  });

  it(`should support searching ${test.api} by firstName`, () => {
    return cloud.withOptions({ qs: { where: `firstName='${updatePayload.firstName}'` } }).get(test.api);
  });

  it(`should allow paginating with page and searching ${test.api} by lastName`, () => {
    return cloud.withOptions({ qs: { page: 1, where: `lastName='${payload.lastName}'` } }).get(test.api);
  });
});
