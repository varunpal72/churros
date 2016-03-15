'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = chakram.expect;

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
  let libraryDocumentId;
  let transientDocumentId;
  let documentId;
  it('should allow GET for ' + test.api, () => {
    return cloud.get(test.api)
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow POST for ' + test.api, () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow GET for ' + test.api + '{libraryDocumentId}', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
      .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + libraryDocumentId))
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow GET for ' + test.api + '{libraryDocumentId}/auditTrail', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
      .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + libraryDocumentId + '/auditTrail'))
      .then(r => expect(r).to.have.statusCode(200))
  });
// As part of the PULL request, Brad is going to look into below commented scripts  
/*
  it('should allow GET /libraryDocuments/{libraryDocumentId}/combinedDocument', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
      .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + libraryDocumentId + '/combinedDocument'))
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow GET /libraryDocuments/{libraryDocumentId}/documents', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
      .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + libraryDocumentId + '/documents'))
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow GET /libraryDocuments/{libraryDocumentId}/documents/{documentId}', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createLibraryDocuments(transientDocumentId)))
      .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + libraryDocumentId + '/documents'))
      .then(r => documentId = r.body.documentId)
      .then(r => cloud.get(test.api + '/' + libraryDocumentId + '/documents/' + documentId))
      .then(r => expect(r).to.have.statusCode(200))
  });
*/
});
