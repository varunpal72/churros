'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const sleep = require('sleep');
const logger = require('winston');

const createLibraryDocuments = (transientDocumentId) => ({
  "libraryDocumentCreationInfo": {
    "libraryTemplateTypes": "DOCUMENT",
    "fileInfos": [{
      "transientDocumentId": transientDocumentId
    }],
    "name": tools.random(),
    "librarySharingMode": "USER"
  },
  "options": {
    "noChrome": false,
    "authoringRequested": false,
    "autoLoginUser": false
  }
});

suite.forElement('esignature', 'libraryDocuments', null, (test) => {
  /*
  // Commented the POST for this resource to avoid creation of new Library Documents, since the code
  // might break for GET /libraryDocuments due to time-out. Also there is no DELETE API for libraryDocuments
    it(`should allow POST for ${test.api}`, () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)));
    });
  */
  let transientDocumentId, libraryDocumentId;
  before(() => cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
    .then(r => transientDocumentId = r.body.id)
    .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
    .then(r => libraryDocumentId = r.body.id)
    .then(r => logger.debug(`IDs: ${transientDocumentId}, ${libraryDocumentId}`)));

  test
    .withApi(`${test.api}/${libraryDocumentId}`)
    .should.return200OnGet();

  it(`should allow GET for ${test.api}/{libraryDocumentId}`, () => {
    return cloud.get(test.api + '/' + libraryDocumentId);
  });

  it(`should allow GET for ${test.api}/{libraryDocumentId}/auditTrail`, () => {
    return cloud.get(test.api + '/' + libraryDocumentId + '/auditTrail');
  });
  it(`should allow GET ${test.api}/{libraryDocumentId}/combinedDocument`, () => {
    sleep.sleep(30);
    return cloud.get(test.api + '/' + libraryDocumentId + '/combinedDocument');
  });
  it(`should allow GET ${test.api}/{libraryDocumentId}/documents`, () => {
    sleep.sleep(30);
    return cloud.get(test.api + '/' + libraryDocumentId + '/documents');
  });
  it(`should allow GET ${test.api}/{libraryDocumentId}/documents/{documentId}`, () => {
    let documentId;
    sleep.sleep(30);
    return cloud.get(test.api + '/' + libraryDocumentId + '/documents')
      .then(r => documentId = r.body.documentId)
      .then(() => sleep.sleep(30))
      .then(r => cloud.get(test.api + '/' + libraryDocumentId + '/documents/' + documentId));
  });
});
