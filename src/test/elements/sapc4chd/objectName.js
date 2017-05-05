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
// Calling the incidents endpoint (ServiceRequestCollection) directly to test {objectName} APIs
suite.forElement('helpdesk', 'ServiceRequestCollection', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  it(`should allow CRUDS for ${test.api}/:id/ServiceRequestDescription`, () => {
    let id, commentId;
    let updatePayload = {
      'Text': 'Got the sauce, thanks for your patience',
      'TypeCode': '10007'
    };
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/ServiceRequestDescription`, commentsPayload))
      .then(r => commentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}/ServiceRequestDescription/${commentId}`))
      .then(r => cloud.patch(`/ServiceRequestDescriptionCollection/${commentId}`, updatePayload))
      .then(r => cloud.get(`${test.api}/${id}/ServiceRequestDescription`))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 }}).get(`${test.api}/${id}/ServiceRequestDescription`))
      .then(r => expect(r.body.length).to.equal(1))
      .then(r => cloud.delete(`/ServiceRequestDescriptionCollection/${commentId}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });

  it(`should allow CRDS for ${test.api}/:id/ServiceRequestAttachmentFolderCollection/attachments`, () => {
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
      .then(r => incidentId = r.body.id)                    //ServiceRequestCollection('{incidentId}')/ServiceRequestAttachmentFolder
      .then(r => cloud.withOptions(metadataOptions).postFile(`${test.api}/${incidentId}/ServiceRequestAttachmentFolder/attachments`, __dirname + '/assets/brady.jpg'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/ServiceRequestAttachmentFolder/${attachmentId}`))
      .then(r => cloud.get(`${test.api}/${incidentId}/ServiceRequestAttachmentFolder`))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 }}).get(`${test.api}/${incidentId}/ServiceRequestAttachmentFolder`))
      .then(r => expect(r.body.length).to.equal(1))
      .then(r => cloud.delete(`/ServiceRequestAttachmentFolderCollection/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
