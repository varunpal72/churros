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
  let workflowId;
  let transientDocumentId;
/*  it('should allow GET for ' + test.api, () => {
    return cloud.get(test.api)
      .then(r => expect(r).to.have.statusCode(200))
  });*/
  test.should.return200OnGet();
  it('should allow GET for ' + test.api + '/{workflowId}', () => {
    return cloud.get(test.api)
      .then(r => workflowId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + workflowId))
  });
  it('should allow POST for ' + test.api + '/{workflowId}/agreements', () => {
    return cloud.get(test.api)
      .then(r => workflowId = r.body[0].id)
      .then(r => cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt'))
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api + '/' + workflowId + '/agreements', createWorkflows(transientDocumentId)))
  });
});
