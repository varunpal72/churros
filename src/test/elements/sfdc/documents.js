'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const documentId = "0150H00000FRylLQAT";
const newObject = {};

suite.forElement('crm', 'Document', (test) => {
  it('retrieves an id from GET /{objectName} with Document', () => {
    return cloud.get(test.api + '/' + documentId + '/data')
    .then(r => expect(r.body).to.not.be.empty);
  });
});
