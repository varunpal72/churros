'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const documentId = "0150H00000FRylLQAT";

suite.forElement('crm', 'Document', (test) => {
  it('should allow GET /{objectName}/{objectId}/data for a Document object', () => {
    return cloud.get(`${test.api}/${documentId}/data`)
    .then(r => expect(r.body).to.not.be.empty);
  });
});
