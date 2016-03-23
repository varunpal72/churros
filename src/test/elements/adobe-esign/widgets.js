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
  /*
  // This script breaks, as there are over 700 widgets which leads to time-out
    test.should.return200OnGet();
  */
  let transientDocumentId, widgetId;
  before(done => cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
  .then(r => transientDocumentId = r.body.id)
  .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
  .then(r => widgetId = r.body.id)
  .then(r => done()));
/*
// Commented the POST for this resource to avoid creation of new Widgets, since the code
// breaks for GET /widgets due to time-out. Also there is no DELETE API for widgets
  it(`should allow POST for ${test.api}`, () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
      .then(r => transientDocumentId = r.body.id)
      .then(r => cloud.post(test.api, createWidget(transientDocumentId)))
  });
*/
  it(`should allow GET ${test.api}/{widgetId}`, () => {
    return cloud.get(test.api + '/' + widgetId);
  });
  it(`should allow GET ${test.api}/{widgetId}/agreements`, () => {
    return cloud.get(test.api + '/' + widgetId + '/agreements');
  });
  it(`should allow GET ${test.api}/{widgetId}/auditTrail`, () => {
    return cloud.get(test.api + '/' + widgetId + '/auditTrail');
  });
  it(`should allow GET ${test.api}/{widgetId}/combinedDocument`, () => {
    return cloud.get(test.api + '/' + widgetId + '/combinedDocument');
  });
  it(`should allow GET ${test.api}/{widgetId}/documents`, () => {
    return cloud.get(test.api + '/' + widgetId + '/documents');
  });
  it(`should allow GET ${test.api}/{widgetId}/documents/{documentId}`, () => {
    let documentId;
    return cloud.get(test.api + '/' + widgetId + '/documents')
      .then(r => documentId = r.body.documentId)
      .then(r => cloud.get(test.api + '/' + widgetId + '/documents/' + documentId));
  });
  it(`should allow GET ${test.api}/{widgetId}/formData`, () => {
    return cloud.get(test.api + '/' + widgetId + '/formData');
  });
  it(`should allow PATCH for ${test.api}/{widgetId}/personalize`, () => {
    return cloud.patch(test.api + '/' + widgetId + '/personalize', updateWidgetPersonalize());
  });
  it(`should allow PATCH for ${test.api}/{widgetId}/status`, () => {
    return cloud.patch(test.api + '/' + widgetId + '/status', updateWidgetStatus());
  });
});
