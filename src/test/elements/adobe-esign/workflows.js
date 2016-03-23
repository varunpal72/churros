'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const winston = require('winston');
const tools = require('core/tools');
const expect = chakram.expect;


const createWorkflows = (transientDocumentId) => ({
  "documentCreationInfo": {
    "formFieldLayerTemplates": [{
      "transientDocumentId": transientDocumentId
    }],
    "locale": "",
    "name": tools.random(),
    "fileInfos": [{
      "transientDocumentId": transientDocumentId,
      "name": tools.random(),
      "workflowLibraryDocumentId": tools.random()
    }],
    "recipientsListInfo": [{
      "recipients": [{
        "email": tools.randomEmail()
      }],
      "name": tools.random()
    }]
  }
});

suite.forElement('esignature', 'workflows', null, (test) => {
  test.should.supportSr();
  it(`should allow POST for ${test.api}/{workflowId}/agreements`, () => {
    let workflowId;
    let transientDocumentId;
    return cloud.get(test.api)
      .then(r => workflowId = r.body[0].id)
      .then(r => cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt'))
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api + '/' + workflowId + '/agreements', createWorkflows(transientDocumentId)))
  });
});
