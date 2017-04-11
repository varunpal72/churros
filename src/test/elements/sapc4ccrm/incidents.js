'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const commentsPayload = require('./assets/comments');
const cloud = require('core/cloud');

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
//TODO probably add a before here to create an incident to use and test pagination etc.
suite.forElement('crm', 'incidents', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  //TODO need pagination for these???
  //TODO need where for these???
  it(`should allow CRUDS for ${test.api}/:id/comments`, () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => {
        id = r.body.id;
        options.churros.updatePayload = { 'Text': 'Got the sauce, thanks for your patience', 'TypeCode': '10007' };
      })
      .then(r => cloud.withOptions(options).cruds(`${test.api}/${id}/comments`, commentsPayload))
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
      .then(r => cloud.get(`${test.api}/${incidentId}/attachments`))  //TODO some paging sort of shz here
      .then(r => cloud.delete(`${test.api}/${incidentId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  })
});
