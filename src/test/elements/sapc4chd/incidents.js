'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const commentsPayload = require('./assets/comments');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

let options = {
  churros: {
    updatePayload: {
      "ServicePriorityCode": "3",
      "Name": {
        "content": "De-prioritized ticket to normal"
      }
    }
  }
};

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  it(`should allow CRUDS for ${test.api}/:id/comments`, () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => {
        id = r.body.id;
        options.churros.updatePayload = { 'Text': 'Got the sauce, thanks for your patience', 'TypeCode': '10007' };
      })
      .then(r => cloud.withOptions(options).cruds(`${test.api}/${id}/comments`, commentsPayload));
  });

  it(`should allow paginating for ${test.api}/:id/comments`, () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/comments`, commentsPayload))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 }}).get(`${test.api}/${id}/comments`))
      .then(r => expect(r.body.length).to.equal(1))
      .then(r => cloud.post(`${test.api}/${id}/comments`, commentsPayload))
      .then(r => cloud.withOptions({ qs: { pageSize: 2 }}).get(`${test.api}/${id}/comments`))
      .then(r => expect(r.body.length).to.equal(2))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });

  it(`should allow CRDS for ${test.api}/:id/attachments`, () => {
    let metadata = {
      "CategoryCode": "2",
      "TypeCode": "10001",
      "FileName": "churrosFileName"
    };
    let incidentId, attachmentId;
    let metadataOptions = {
      formData: {
        metadata: JSON.stringify(metadata)
      }
    };
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.withOptions(metadataOptions).postFile(`${test.api}/${incidentId}/attachments`, __dirname + '/assets/brady.jpg'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments`))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 }}).get(`${test.api}/${incidentId}/attachments`))
      .then(r => expect(r.body.length).to.equal(1))
      .then(r => cloud.delete(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  })
});
