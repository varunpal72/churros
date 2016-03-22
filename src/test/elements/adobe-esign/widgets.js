'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const winston = require('winston');
const chakram = require('chakram');
const expect = chakram.expect;
const tools = require('core/tools');

const createWidget = (transientDocumentId) => ({
  "widgetCreationInfo": {
    "fileInfos": [{
      "transientDocumentId": transientDocumentId
    }],
    "name": tools.random(),
    "signatureFlow": "SENDER_SIGNATURE_NOT_REQUIRED"
  }
});

const updateWidgetPersonalize = () => ({
  "email": tools.randomEmail()
});

const updateWidgetStatus = () => ({
  "message": "Testing widget status",
  "value": "ENABLE"
});

suite.forElement('esignature', 'widgets', null, (test) => {
  let widgetId;
  let transientDocumentId;
  let documentId;
  it('should allow POST for ' + test.api, () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
  });
// As part of the PULL request, Brad is going to look into below commented script
/*
  it('should allow GET for ' + test.api, () => {
    return cloud.get(test.api)
      .then(r => expect(r).to.have.statusCode(200))
  });
*/
  it('should allow GET ' + test.api + '/{widgetId}', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId))
  });
  it('should allow GET ' + test.api + '/{widgetId}/agreements', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId + '/agreements'))
  });
  it('should allow GET ' + test.api + '/{widgetId}/auditTrail', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId + '/auditTrail'))
  });
  it('should allow GET ' + test.api + '/{widgetId}/combinedDocument', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId + '/combinedDocument'))
  });
  it('should allow GET ' + test.api + '/{widgetId}/documents', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId + '/documents'))
  });
  it('should allow GET ' + test.api + '/{widgetId}/documents/{documentId}', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId + '/documents'))
      .then(r => documentId = r.body.documentId)
      .then(r => cloud.get(test.api + '/' + widgetId + '/documents/' + documentId))
  });
  it('should allow GET ' + test.api + '/{widgetId}/formData', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.get(test.api + '/' + widgetId + '/formData'))
  });
  it('should allow PATCH for ' + test.api + '/{widgetId}/personalize', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.patch(test.api + '/' + widgetId + '/personalize', updateWidgetPersonalize()))
  });
  it('should allow PATCH for ' + test.api + '/{widgetId}/status', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
      .then(r => widgetId = r.body.id)
      .then(r => cloud.patch(test.api + '/' + widgetId + '/status', updateWidgetStatus()))
  });
});
